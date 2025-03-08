import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'El nombre completo del usuario.',
  })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({
    example: 'admin@admin.com',
    description: 'El correo electrónico del usuario.',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'La contraseña del usuario.',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
