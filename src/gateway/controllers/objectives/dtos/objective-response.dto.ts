import { ApiProperty } from '@nestjs/swagger';

export class ObjectiveResponseDto {
  @ApiProperty({
    description: 'ID de la objetivo',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre de la objetivo',
    example: 'Objetivo de ejemplo',
  })
  name: string;

  @ApiProperty({
    description: 'Descripción de la objetivo',
    example: 'Descripción de la objetivo',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'ID del servicio al que pertenece la objetivo',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  serviceId: string;

  @ApiProperty({
    description: 'Actividades de la objetivo',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    required: false,
  })
  activities?: string[];
}
