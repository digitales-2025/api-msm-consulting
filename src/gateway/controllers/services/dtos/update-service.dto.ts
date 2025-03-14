import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateServiceDto {
  @ApiProperty({
    description: 'El nombre del servicio',
    example: 'Servicio 1',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'La descripción del servicio',
    example: 'Descripción del servicio',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Los objetivos del servicio',
    example: ['Objetivo 1', 'Objetivo 2'],
  })
  @IsArray()
  @IsOptional()
  objectives?: string[];
}
