import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateObjectiveDto {
  @ApiProperty({
    description: 'El nombre del objetivo',
    example: 'Objetivo 1',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'La descripción del objetivo',
    example: 'Descripción del objetivo 1',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'El ID del servicio al que pertenece el objetivo',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsOptional()
  serviceId?: string;
}
