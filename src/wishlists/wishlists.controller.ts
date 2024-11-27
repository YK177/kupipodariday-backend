import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRequest } from '../types';
import { WishlistsInterceptor } from './interceptors/wishlists.interceptor';

@Controller('wishlistlists')
@UseGuards(JwtAuthGuard)
@UseInterceptors(WishlistsInterceptor)
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @Post()
  create(@Request() { user }: UserRequest, @Body() dto: CreateWishlistDto) {
    return this.wishlistsService.create(user, dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishlistsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Request() { user }: UserRequest,
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return this.wishlistsService.update(user, +id, updateWishlistDto);
  }

  @Delete(':id')
  remove(@Request() { user }: UserRequest, @Param('id') id: string) {
    return this.wishlistsService.remove(user, +id);
  }
}
