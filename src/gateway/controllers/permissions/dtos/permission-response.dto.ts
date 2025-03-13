import { ApiProperty } from '@nestjs/swagger';

export class PermissionResponseDto {
  @ApiProperty({
    description: 'ID único del permiso',
    example: '5f9d5e7b8e7a6c1d4c8e7a6c',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre del permiso',
    example: 'users:create',
  })
  name: string;

  @ApiProperty({
    description: 'Descripción del permiso',
    example: 'Permite crear usuarios en el sistema',
    required: false,
    nullable: true,
  })
  description?: string;

  @ApiProperty({
    description: 'Recurso al que aplica el permiso',
    example: 'users',
  })
  resource: string;

  @ApiProperty({
    description: 'Acción que permite el permiso',
    example: 'create',
  })
  action: string;

  @ApiProperty({
    description: 'Fecha de creación del permiso',
    example: '2023-01-15T14:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización del permiso',
    example: '2023-01-20T10:15:00Z',
  })
  updatedAt: Date;
}
