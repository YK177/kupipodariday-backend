import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateWishDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(250)
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(1024)
  description: string;
}
