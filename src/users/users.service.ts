import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, QueryFailedError, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ERROR_MESSAGES } from '../constants/error-messages';
import { Wish } from '../wishes/entities/wish.entity';

const SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  private hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  async create(dto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.hashPassword(dto.password);
    return await this.usersRepository.save({
      ...dto,
      password: hashedPassword,
    });
  }

  async findOne<T extends keyof User>(key: T, param: User[T]): Promise<User> {
    return await this.usersRepository.findOneBy({ [key]: param });
  }

  async updateOne(user: User, dto: UpdateUserDto): Promise<User> {
    const { id } = user;

    const updatedUser = { ...dto };

    if ('password' in dto) {
      updatedUser.password = await this.hashPassword(dto.password);
    }

    try {
      await this.usersRepository.update(id, updatedUser);
      return await this.usersRepository.findOneByOrFail({ id });
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new ConflictException(ERROR_MESSAGES.USER_EXISTS);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async findMany(query: string): Promise<User[]> {
    return await this.usersRepository.find({
      where: [{ username: Like(`%${query}%`) }, { email: Like(`%${query}%`) }],
    });
  }

  async findOwnWishes(userId: number) {
    const user = await this.usersRepository.findOne({
      relations: ['wishes'],
      where: { id: userId },
    });

    return user?.wishes ?? [];
  }

  async findUserWishes(username: string): Promise<Wish[]> {
    const user = await this.usersRepository.findOne({
      relations: ['wishes'],
      where: { username },
    });
    return user.wishes ?? [];
  }
}
