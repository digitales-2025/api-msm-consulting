import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({
    description: 'El nombre del servicio',
    example: 'Servicio de ejemplo',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'La descripción del servicio',
    example: 'Descripción del servicio de ejemplo',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Los objetivos del servicio',
    example: ['Objetivo 1', 'Objetivo 2'],
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  objectives?: string[];
}
