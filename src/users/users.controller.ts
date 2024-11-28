import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRequest } from '../types';
import { UsersInterceptor } from './interceptors/users.interceptor';

@Controller('users')
@UseInterceptors(UsersInterceptor)
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  findMe(@Request() { user }: UserRequest) {
    return user;
  }

  @Patch('me')
  update(
    @Request() { user }: UserRequest,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateOne(user, updateUserDto);
  }

  @Get(':username')
  async getUserByUsername(@Param('username') username: string) {
    return await this.usersService.findOne('username', username);
  }

  @Post('find')
  async findMany(@Body('query') query: string) {
    return this.usersService.findMany(query);
  }

  @Get('me/wishes')
  async getOwnWishes(@Request() { user }: UserRequest) {
    return await this.usersService.findOwnWishes(user.id);
  }

  @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string) {
    return await this.usersService.findUserWishes(username);
  }
}
