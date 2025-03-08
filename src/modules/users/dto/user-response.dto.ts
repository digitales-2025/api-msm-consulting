import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: '1', description: 'ID único del usuario' })
  id: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Nombre completo del usuario',
  })
  fullName: string;

  @ApiProperty({
    example: 'admin@admin.com',
    description: 'Correo electrónico del usuario',
  })
  email: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Fecha de creación del usuario',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Fecha de última actualización del usuario',
  })
  updatedAt: Date;
}
