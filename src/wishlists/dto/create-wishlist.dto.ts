import {
  IsArray,
  IsNotEmpty,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(250)
  name: string;

  @IsUrl()
  @IsNotEmpty()
  image: string;

  @IsArray()
  itemsId: number[];
}
