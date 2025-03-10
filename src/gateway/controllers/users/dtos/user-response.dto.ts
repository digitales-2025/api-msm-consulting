import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'ID único del usuario',
    example: '5f9d5e7b8e7a6c1d4c8e7a6c',
  })
  id: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'usuario@ejemplo.com',
  })
  email: string;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
  })
  fullName: string;

  @ApiProperty({
    description: 'Roles del usuario',
    example: ['user', 'admin'],
    isArray: true,
  })
  roles: string[];

  @ApiProperty({
    description: 'Estado del usuario (activo/inactivo)',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Fecha de creación del usuario',
    example: '2023-01-15T14:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización del usuario',
    example: '2023-01-20T10:15:00Z',
  })
  updatedAt: Date;
}
