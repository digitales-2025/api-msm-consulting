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
    example: 'Permite crear usuarios',
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
}
