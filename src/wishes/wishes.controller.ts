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
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRequest } from '../types';
import { WishesInterceptor } from './interceptors/wishes.interceptor';
import { UpdateWishDto } from './dto/update-wish.dto';

@Controller('wishes')
@UseInterceptors(WishesInterceptor)
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() { user }: UserRequest, @Body() dto: CreateWishDto) {
    return this.wishesService.create(user, dto);
  }

  @Get('last')
  async findLast() {
    return this.wishesService.findLastWishes();
  }

  @Get('top')
  async findTop() {
    return this.wishesService.findTopWishes();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.wishesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Request() { user }: UserRequest,
    @Param('id') id: string,
    @Body() dto: UpdateWishDto,
  ) {
    return this.wishesService.update(user, +id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Request() { user }: UserRequest, @Param('id') id: string) {
    return this.wishesService.remove(user, +id);
  }

  @Post(':id/copy')
  @UseGuards(JwtAuthGuard)
  copy(@Request() { user }: UserRequest, @Param('id') id: string) {
    return this.wishesService.copy(user, +id);
  }
}
