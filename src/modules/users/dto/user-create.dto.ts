import { IsArray, IsEmail, IsString, MinLength } from 'class-validator';

export class UserCreateDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  fullName: string;

  @IsString()
  @IsArray()
  role: string[];
}
