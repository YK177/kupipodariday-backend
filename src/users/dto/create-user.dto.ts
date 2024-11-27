import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  IsUrl,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  about: string;

  @IsUrl()
  avatar: string;

  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;
}
