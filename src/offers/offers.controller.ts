import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UserRequest } from '../types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OffersInterceptor } from './interceptors/offers.interceptor';

@Controller('offers')
@UseInterceptors(OffersInterceptor)
@UseGuards(JwtAuthGuard)
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(@Request() { user }: UserRequest, @Body() dto: CreateOfferDto) {
    return this.offersService.create(user, dto);
  }

  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offersService.findOne(+id);
  }
}
