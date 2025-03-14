import { ApiProperty } from '@nestjs/swagger';

export class ServiceResponseDto {
  @ApiProperty({
    description: 'El ID del servicio',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'El nombre del servicio',
    example: 'Servicio de ejemplo',
  })
  name: string;

  @ApiProperty({
    description: 'La descripción del servicio',
    example: 'Descripción del servicio de ejemplo',
  })
  description?: string;

  @ApiProperty({
    description: 'Los objetivos del servicio',
    example: ['Objetivo 1', 'Objetivo 2'],
    isArray: true,
  })
  objectives?: string[];

  @ApiProperty({
    description: 'El estado del servicio',
    example: true,
  })
  isActive: boolean;
}
