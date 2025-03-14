import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateActivityDto {
  @ApiProperty({
    description: 'El nombre de la actividad',
    example: 'Activity 1',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'La descripción de la actividad',
    example: 'Descripción de la actividad',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'El ID del usuario responsable de la actividad',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsString()
  @IsOptional()
  responsibleUserId?: string;

  @ApiProperty({
    description: 'La frecuencia de la actividad',
    example: 'YEARLY',
  })
  @IsString()
  @IsOptional()
  frequency?: string;

  @ApiProperty({
    description: 'La fecha de programación de la actividad',
    example: '2025-03-22',
  })
  @IsDateString({ strict: true })
  @IsOptional()
  scheduleDate?: string;

  @ApiProperty({
    description: 'La fecha de ejecución de la actividad',
    example: '2025-03-22',
  })
  @IsDateString({ strict: true })
  @IsOptional()
  executionDate?: string;
}
