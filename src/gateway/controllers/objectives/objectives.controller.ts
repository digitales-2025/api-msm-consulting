import { GetObjectivesByServiceIdUseCase } from '@/application/use-cases/objectives/get-objectives-by-service-id.use-case';
import { Auth } from '@/gateway/decorators/auth.decorator';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateObjectiveUseCase } from '../../../application/use-cases/objectives/create-objective.use-case';
import { CreateObjectiveDto } from './dtos/create-objective.dto';
import { ObjectiveResponseDto } from './dtos/objective-response.dto';
@Controller({
  path: 'objectives',
  version: '1',
})
@Auth()
export class ObjectivesController {
  constructor(
    private readonly createObjectiveUseCase: CreateObjectiveUseCase,
    private readonly getObjectivesByServiceIdUseCase: GetObjectivesByServiceIdUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva objetivo' })
  @ApiResponse({
    status: 201,
    description: 'Objetivo creado con éxito',
    type: ObjectiveResponseDto,
  })
  async create(
    @Body() createObjectiveDto: CreateObjectiveDto,
  ): Promise<ObjectiveResponseDto> {
    const objective =
      await this.createObjectiveUseCase.execute(createObjectiveDto);

    return {
      id: objective.id,
      name: objective.name,
      description: objective.description,
      serviceId: objective.serviceId,
      activities: objective.activities,
    };
  }

  @Get(':serviceId')
  @ApiOperation({ summary: 'Obtener todas las objetivos de un servicio' })
  @ApiResponse({
    status: 200,
    description: 'Lista de objetivos',
    type: [ObjectiveResponseDto],
  })
  async getObjectivesByServiceId(
    @Param('serviceId') serviceId: string,
  ): Promise<ObjectiveResponseDto[]> {
    const objectives =
      await this.getObjectivesByServiceIdUseCase.execute(serviceId);

    return objectives.map((objective) => ({
      id: objective.id,
      name: objective.name,
      description: objective.description,
      serviceId: objective.serviceId,
      activities: objective.activities,
    }));
  }
}
