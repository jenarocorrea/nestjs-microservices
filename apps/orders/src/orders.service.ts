import { Injectable, Inject } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { SqsProducerService } from './sqs/sqs-producer.module';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private sqsProducerService: SqsProducerService,
    @Inject('USERS_SERVICE') private usersClient: ClientProxy,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const user = await this.usersClient
      .send({ cmd: 'getUser' }, createOrderDto.userId)
      .toPromise();

    if (!user) {
      throw new Error('User not found');
    }

    const newOrder = this.ordersRepository.create(createOrderDto);
    newOrder.shippingAddress = user.address;
    const savedOrder = await this.ordersRepository.save(newOrder);

    // Usar SqsProducerService para enviar mensaje a SQS
    await this.sqsProducerService.sendMessage({
      orderId: savedOrder.id,
      user: user.name,
      details: createOrderDto.details,
    });

    return savedOrder;
  }
  async findOne(id: number): Promise<Order | undefined> {
    return await this.ordersRepository.findOne({
      where: { id },
    });
  }

  findAll() {
    return `This action returns all orders`;
  }

  // update(id: number, updateOrderDto: UpdateOrderDto) {
  //   return `This action updates a #${id} order`;
  // }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
