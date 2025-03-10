import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Token de actualización para renovar el token de acceso',
    example: '7a6c5f9d5e7b8e1d4c8e7a6c...',
  })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
