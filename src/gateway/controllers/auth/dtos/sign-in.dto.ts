import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    example: 'admin@admin.com',
    description: 'El email del usuario.',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password',
    description: 'La contraseña del usuario',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
