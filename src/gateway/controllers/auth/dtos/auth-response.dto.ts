import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    description: 'Estado HTTP de la respuesta',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Mensaje informativo sobre la operación',
    example: 'Operación realizada con éxito',
    required: false,
  })
  message?: string;

  @ApiProperty({
    description: 'ID único del usuario',
    example: '5f9d5e7b8e7a6c1d4c8e7a6c',
    required: false,
  })
  id?: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'usuario@ejemplo.com',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
    required: false,
  })
  fullName?: string;

  @ApiProperty({
    description: 'Roles del usuario',
    example: ['user', 'admin'],
    isArray: true,
    required: false,
  })
  roles?: string[];
}
