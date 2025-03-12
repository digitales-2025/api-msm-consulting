import { ApiProperty } from '@nestjs/swagger';
import { PermissionResponseDto } from '../../permissions/dtos/permission-response.dto';

export class RoleResponseDto {
  @ApiProperty({
    description: 'ID único del rol',
    example: '5f9d5e7b8e7a6c1d4c8e7a6c',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre del rol',
    example: 'admin',
  })
  name: string;

  @ApiProperty({
    description: 'Descripción del rol',
    example: 'Administrador del sistema con acceso completo',
    required: false,
    nullable: true,
  })
  description?: string;

  @ApiProperty({
    description: 'Permisos asignados al rol',
    type: [PermissionResponseDto],
    required: false,
  })
  permissions?: PermissionResponseDto[];

  @ApiProperty({
    description: 'Fecha de creación del rol',
    example: '2023-01-15T14:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización del rol',
    example: '2023-01-20T10:15:00Z',
  })
  updatedAt: Date;
}
