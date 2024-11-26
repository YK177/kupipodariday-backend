import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ERROR_MESSAGES } from '../constants/error-messages';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(dto: CreateUserDto): Promise<User> {
    const [existUserByName, existUserByEmail] = await Promise.all([
      this.usersService.findOne('username', dto.username),
      this.usersService.findOne('email', dto.email),
    ]);

    if (existUserByName || existUserByEmail) {
      throw new ConflictException(ERROR_MESSAGES.USER_EXISTS);
    }

    return this.usersService.create(dto);
  }

  auth(user: User) {
    const payload = { usernane: user.username, sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async validatePassword(username: string, password: string) {
    const user = await this.usersService.findOne('username', username);

    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES.WRONG_LOGIN_PASSWORD);
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      throw new UnauthorizedException(ERROR_MESSAGES.WRONG_LOGIN_PASSWORD);
    }

    return user;
  }
}
