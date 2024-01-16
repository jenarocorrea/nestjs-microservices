import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
//import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @Inject('USERS_SERVICE') private usersClient: ClientProxy,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const user = await this.usersClient
      .send({ cmd: 'getUser' }, createOrderDto.userId)
      .toPromise();
    if (!user) {
      throw new Error('User not found');
    }
    // Aquí puedes incluir lógica adicional, como añadir la dirección del usuario al pedido.
    const newOrder = this.ordersRepository.create(createOrderDto);
    return await this.ordersRepository.save(newOrder);
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
