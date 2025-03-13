import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateRoleDto {
  @ApiProperty({
    description: 'Nombre del rol',
    example: 'super-admin',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Descripción del rol',
    example: 'Rol con acceso ampliado a todas las funciones',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description:
      'IDs de los permisos asignados al rol (reemplaza todos los permisos existentes)',
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '223e4567-e89b-12d3-a456-426614174001',
    ],
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true })
  permissionIds?: string[];
}
