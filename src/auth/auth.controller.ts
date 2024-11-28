import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LocalGuard } from './guards/local-auth.guard';
import { UserRequest } from '../types';
import { UsersInterceptor } from '../users/interceptors/users.interceptor';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UseInterceptors(UsersInterceptor)
  async signup(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signup(createUserDto);
  }

  @UseGuards(LocalGuard)
  @Post('signin')
  signin(@Request() { user }: UserRequest) {
    return this.authService.auth(user);
  }
}
