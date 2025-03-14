import { Auth } from '@/gateway/decorators/auth.decorator';
import { Body, Controller, Post } from '@nestjs/common';
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
}
