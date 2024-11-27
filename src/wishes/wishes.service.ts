import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { User } from '../users/entities/user.entity';
import { ERROR_MESSAGES } from '../constants/error-messages';

const NUMBER_OF_LAST_WISHES = 40;
const NUMBER_OF_TOP_WISHES = 10;

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private readonly wishRepository: Repository<Wish>,
  ) {}

  private async getWishById(user: User, id: number): Promise<Wish> {
    const wish = await this.wishRepository.findOneOrFail({
      relations: ['owner'],
      where: { id },
    });

    if (wish.owner.id !== user.id) {
      throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN);
    }

    return wish;
  }

  private async copyWish(user: User, wish?: Wish): Promise<Wish> {
    if (!wish) {
      throw new NotFoundException(ERROR_MESSAGES.WISH_NOT_FOUND);
    }

    wish.owner = user;
    delete wish.id;

    return await this.wishRepository.save(wish);
  }

  async create(user: User, dto: CreateWishDto): Promise<Wish> {
    return this.wishRepository.save({ ...dto, owner: user });
  }

  async findLastWishes(): Promise<Wish[]> {
    return await this.wishRepository.find({
      relations: ['owner'],
      order: {
        createdAt: 'DESC',
      },
      take: NUMBER_OF_LAST_WISHES,
    });
  }

  async findTopWishes(): Promise<Wish[]> {
    return await this.wishRepository.find({
      relations: ['owner'],
      order: {
        copied: 'DESC',
      },
      take: NUMBER_OF_TOP_WISHES,
    });
  }

  async findOne(id: number): Promise<Wish> {
    return await this.wishRepository.findOneOrFail({
      relations: ['owner'],
      where: { id },
    });
  }

  async update(user: User, id: number, dto: UpdateWishDto): Promise<Wish> {
    const wishToUpdate = await this.getWishById(user, id);

    // нельзя изменять стоимость подарка, если уже есть желающие скинуться
    if (dto.price && wishToUpdate.raised > 0) {
      throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN);
    }

    return await this.wishRepository.save({ ...wishToUpdate, dto });
  }

  async remove(user: User, id: number) {
    const wishToRemove = await this.getWishById(user, id);

    return await this.wishRepository.remove(wishToRemove);
  }

  async copy(user: User, id: number): Promise<Wish> {
    const wishToCopy = await this.wishRepository.findOneBy({ id });
    return this.copyWish(user, wishToCopy);
  }
}
