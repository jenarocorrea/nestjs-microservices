import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Public, Roles } from 'nest-keycloak-connect';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @Roles({ roles: ['admin'] })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Get()
  @Public()
  findAll() {
    return this.ordersService.findAll();
  }

  @Patch(':id')
  @Roles({ roles: ['admin'] })
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  @Roles({ roles: ['admin'] })
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
