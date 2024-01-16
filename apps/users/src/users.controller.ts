import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Public, Roles } from 'nest-keycloak-connect';
import { CreateUserDto } from './dto/create-user.dto';
import { MessagePattern } from '@nestjs/microservices';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @Roles({ roles: ['admin'] })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Get()
  @Public()
  findAll() {
    return this.usersService.findAll();
  }

  @Patch(':id')
  @Roles({ roles: ['admin'] })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Roles({ roles: ['admin'] })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @MessagePattern({ cmd: 'getUser' })
  getUser(data: any) {
    console.log('data', data);
    return this.usersService.findOne(data.id);
  }
}
