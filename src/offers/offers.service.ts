import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { Repository } from 'typeorm';
import { ERROR_MESSAGES } from '../constants/error-messages';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(user: User, dto: CreateOfferDto): Promise<Offer> {
    const wish = await this.wishRepository.findOneOrFail({
      where: { id: dto.itemId },
      relations: ['owner'],
    });

    if (user.id === wish.owner.id) {
      throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN);
    }

    const raised = +wish.raised + dto.amount;

    if (raised > +wish.price) {
      throw new BadRequestException(ERROR_MESSAGES.TOO_MUCH_OFFER);
    }

    try {
      const updatedWish = await this.wishRepository.save({ ...wish, raised });
      return await this.offerRepository.save({
        amount: dto.amount,
        item: updatedWish,
        user,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  findAll(): Promise<Offer[]> {
    return this.offerRepository.find({ relations: ['item', 'user'] });
  }

  findOne(id: number): Promise<Offer> {
    return this.offerRepository.findOneOrFail({
      relations: ['item', 'user'],
      where: { id },
    });
  }
}
