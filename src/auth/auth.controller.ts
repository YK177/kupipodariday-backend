import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LocalGuard } from './guards/local-auth.guard';
import { UserRequest } from '../types';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.signup(createUserDto);
    const { password: _password, email: _email, ...returnedUser } = user;

    return returnedUser;
  }

  @UseGuards(LocalGuard)
  @Post('signin')
  signin(@Request() { user }: UserRequest) {
    return this.authService.auth(user);
  }
}
