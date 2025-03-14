import { DeleteObjectiveUseCase } from '@/application/use-cases/objectives/delete-objective.use-case';
import { GetObjectivesByServiceIdUseCase } from '@/application/use-cases/objectives/get-objectives-by-service-id.use-case';
import { UpdateObjectiveUseCase } from '@/application/use-cases/objectives/update-objetive.use-case';
import { Auth } from '@/gateway/decorators/auth.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateObjectiveUseCase } from '../../../application/use-cases/objectives/create-objective.use-case';
import { CreateObjectiveDto } from './dtos/create-objective.dto';
import { ObjectiveResponseDto } from './dtos/objective-response.dto';
import { UpdateObjectiveDto } from './dtos/update-objetive.dto';
@Controller({
  path: 'objectives',
  version: '1',
})
@Auth()
export class ObjectivesController {
  constructor(
    private readonly createObjectiveUseCase: CreateObjectiveUseCase,
    private readonly getObjectivesByServiceIdUseCase: GetObjectivesByServiceIdUseCase,
    private readonly updateObjectiveUseCase: UpdateObjectiveUseCase,
    private readonly deleteObjectiveUseCase: DeleteObjectiveUseCase,
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

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una objetivo existente' })
  @ApiResponse({
    status: 200,
    description: 'Objetivo actualizado con éxito',
    type: ObjectiveResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateObjectiveDto: UpdateObjectiveDto,
  ): Promise<ObjectiveResponseDto> {
    const objective = await this.updateObjectiveUseCase.execute({
      id,
      ...updateObjectiveDto,
    });

    return {
      id: objective.id,
      name: objective.name,
      description: objective.description,
      serviceId: objective.serviceId,
      activities: objective.activities,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una objetivo existente' })
  @ApiResponse({
    status: 200,
    description: 'Objetivo eliminado con éxito',
  })
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.deleteObjectiveUseCase.execute(id);
    return { message: 'Objetivo eliminado con éxito' };
  }
}
