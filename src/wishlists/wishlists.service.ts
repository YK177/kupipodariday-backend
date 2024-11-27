import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { In, Repository } from 'typeorm';
import { Wish } from '../wishes/entities/wish.entity';
import { User } from '../users/entities/user.entity';
import { ERROR_MESSAGES } from '../constants/error-messages';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class WishlistsService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async findAll(): Promise<Wishlist[]> {
    return await this.wishlistRepository.find({
      relations: ['owner'],
    });
  }

  async create(user: User, dto: CreateWishlistDto) {
    console.log({ dto });
    const items = await this.wishRepository.find({
      where: { id: In(dto.itemsId) },
    });
    const wishlist = new Wishlist();
    wishlist.owner = user;
    wishlist.name = dto.name;
    wishlist.image = dto.image;
    wishlist.items = items;
    return await this.wishlistRepository.save(wishlist);
  }

  async findOne(id: number) {
    return await this.wishlistRepository.findOneOrFail({
      where: { id },
      relations: ['items', 'owner'],
    });
  }

  async update(user: User, id: number, updateWishlistDto: UpdateWishlistDto) {
    const wishlistToUpdate = await this.wishlistRepository.findOneOrFail({
      where: { id },
      relations: ['owner', 'items'],
    });

    if (wishlistToUpdate.owner.id !== user.id) {
      return new ForbiddenException(ERROR_MESSAGES.FORBIDDEN);
    }

    const items = updateWishlistDto.itemsId?.length
      ? await this.wishRepository.find({
          where: { id: In(updateWishlistDto.itemsId) },
        })
      : [];

    return await this.wishlistRepository.save({
      ...wishlistToUpdate,
      name: updateWishlistDto.name,
      image: updateWishlistDto.image,
      items: items.length === 0 ? wishlistToUpdate.items : items,
    });
  }

  async remove(user: User, id: number) {
    const wishlistToRemove = await this.wishlistRepository.findOneOrFail({
      where: { id },
      relations: ['owner'],
    });

    if (wishlistToRemove.owner.id !== user.id) {
      return new ForbiddenException(ERROR_MESSAGES.FORBIDDEN);
    }

    return await this.wishlistRepository.remove(wishlistToRemove);
  }
}
