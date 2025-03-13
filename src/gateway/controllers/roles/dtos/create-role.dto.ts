import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Nombre del rol',
    example: 'admin',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Descripción del rol',
    example: 'Rol de administrador con acceso completo',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'IDs de los permisos asignados al rol',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    isArray: true,
  })
  @IsOptional()
  permissionIds?: string[];
}
