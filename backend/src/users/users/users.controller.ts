import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity } from '../entities/user.entity';
import { EvendemyRequest } from 'src/shared/evendemy-request';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Req() request: EvendemyRequest) {
    return this.usersService.findAll()
      .then(users => users.map(u=>UserEntity.toDTO(u)));
  }

}
