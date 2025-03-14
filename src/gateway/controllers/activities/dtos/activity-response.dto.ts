import { ApiProperty } from '@nestjs/swagger';

export class ActivityResponseDto {
  @ApiProperty({
    description: 'El ID de la actividad',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'El nombre de la actividad',
    example: 'Activity 1',
  })
  name: string;

  @ApiProperty({
    description: 'La descripción de la actividad',
    example: 'Descripción de la actividad',
  })
  description: string;

  @ApiProperty({
    description: 'El ID del usuario responsable de la actividad',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  responsibleUserId: string;

  @ApiProperty({
    description: 'La frecuencia de la actividad',
    example: 'YEARLY',
  })
  frequency: string;

  @ApiProperty({
    description: 'La fecha de programación de la actividad',
    example: '2025-03-22',
  })
  scheduleDate: string;

  @ApiProperty({
    description: 'La fecha de ejecución de la actividad',
    example: '2025-03-22',
  })
  executionDate: string;

  @ApiProperty({
    description: 'El ID del objetivo al que pertenece la actividad',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  objectiveId: string;
}
