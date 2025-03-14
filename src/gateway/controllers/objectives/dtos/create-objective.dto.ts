import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateObjectiveDto {
  @ApiProperty({
    description: 'Nombre de la objetivo',
    example: 'Objetivo de ejemplo',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Descripción de la objetivo',
    example: 'Descripción de la objetivo',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'ID del servicio al que pertenece la objetivo',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  serviceId: string;

  @ApiProperty({
    description: 'Actividades de la objetivo',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  activities?: string[];
}
