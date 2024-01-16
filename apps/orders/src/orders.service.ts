import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { SqsProducerService } from './sqs/sqs-producer.module';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private sqsProducerService: SqsProducerService,
    @Inject('USERS_SERVICE') private usersClient: ClientProxy,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      // Attempt to retrieve the user associated with the ID provided in the DTO
      const user = await this.usersClient
        .send({ cmd: 'getUser' }, createOrderDto.userId)
        .toPromise();

      // If the user is not found, throw an HttpException
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // Attempt to create a new order
      const newOrder = this.ordersRepository.create({
        ...createOrderDto,
        shippingAddress: user.address,
      });

      // Save the new order to the database
      const savedOrder = await this.ordersRepository.save(newOrder);

      // Send a message to SQS with the order details
      await this.sqsProducerService.sendMessage({
        orderId: savedOrder.id,
        user: user.name,
        details: createOrderDto.details,
      });

      // Return the saved order
      return savedOrder;
    } catch (error) {
      // Handling generic or unknown errors
      throw new HttpException(
        'Error creating order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number): Promise<Order | undefined> {
    return await this.ordersRepository.findOne({
      where: { id },
    });
  }

  async findAll(): Promise<Order[]> {
    return await this.ordersRepository.find();
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
    });
    if (!order) {
      throw new Error('Order not found');
    }
    const updatedOrder = this.ordersRepository.merge(order, updateOrderDto);
    return this.ordersRepository.save(updatedOrder);
  }

  async remove(id: number): Promise<void> {
    const order = await this.ordersRepository.findOne({
      where: { id },
    });
    if (!order) {
      throw new Error('Order not found');
    }
    await this.ordersRepository.remove(order);
  }
}
