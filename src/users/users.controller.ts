import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/guards/admin.guard';
import { UsersService } from './users.service';
import { UUID } from 'crypto';


@UseGuards(AdminGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.usersService.findAll();
  }

  @Get(':id')
  getUserById(@Param('id') id: UUID) {
    return this.usersService.findOneById(id);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: UUID) {
    return this.usersService.remove(id);
  }
}