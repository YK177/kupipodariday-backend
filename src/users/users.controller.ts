import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersInterceptor } from './interceptors/users.interceptor';
import { Request as IRequest } from 'express';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { ERROR_MESSAGES } from '../constants/error-messages';

interface UserRequest extends IRequest {
  user: User;
}

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
    const user = await this.usersService.findOne('username', username);

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return user;
  }

  @Post('find')
  async findMany(@Body('query') query: string) {
    return this.usersService.findMany(query);
  }

  @Get('me/wishes')
  getOwnWishes(@Request() { user }: UserRequest) {
    return user.wishes ?? [];
  }

  @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string) {
    return await this.usersService.findUserWishes(username);
  }
}
