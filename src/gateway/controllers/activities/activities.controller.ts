import { CreateActivityUseCase } from '@/application/use-cases/activities/create-activity.use-case';
import { DeleteActivityUseCase } from '@/application/use-cases/activities/delete-activity.use-case';
import { GetActivitiesByObjectiveIdUseCase } from '@/application/use-cases/activities/get-activities-by-objetive-id.use-case';
import { UpdateActivityUseCase } from '@/application/use-cases/activities/update-activity.use-case';
import { Auth } from '@/gateway/decorators/auth.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ActivityResponseDto } from './dtos/activity-response.dto';
import { CreateActivityDto } from './dtos/create-activity.dto';
import { UpdateActivityDto } from './dtos/update-activity.dto';

@ApiTags('Activities')
@Controller({
  path: 'activities',
  version: '1',
})
@Auth()
export class ActivitiesController {
  constructor(
    private readonly createActivityUseCase: CreateActivityUseCase,
    private readonly getActivitiesByObjectiveIdUseCase: GetActivitiesByObjectiveIdUseCase,
    private readonly updateActivityUseCase: UpdateActivityUseCase,
    private readonly deleteActivityUseCase: DeleteActivityUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva actividad' })
  @ApiResponse({
    status: 201,
    description: 'La actividad ha sido creada correctamente',
    type: ActivityResponseDto,
  })
  async create(
    @Body() createActivityDto: CreateActivityDto,
  ): Promise<ActivityResponseDto> {
    const activity =
      await this.createActivityUseCase.execute(createActivityDto);
    return {
      id: activity.id,
      name: activity.name,
      description: activity.description,
      responsibleUserId: activity.responsibleUserId ?? '',
      frequency: activity.frequency ?? '',
      scheduleDate: activity.scheduleDate ?? '',
      executionDate: activity.executionDate ?? '',
      objectiveId: activity.objectiveId,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Obtener actividades por objetivo' })
  @ApiResponse({
    status: 200,
    description: 'Las actividades han sido obtenidas correctamente',
    type: [ActivityResponseDto],
  })
  @ApiQuery({
    name: 'objectiveId',
    description: 'ID del objetivo para filtrar actividades',
    required: true,
    type: String,
  })
  async getActivitiesByObjectiveId(
    @Query('objectiveId') objectiveId: string,
  ): Promise<ActivityResponseDto[]> {
    const activities =
      await this.getActivitiesByObjectiveIdUseCase.execute(objectiveId);
    return activities.map((activity) => ({
      id: activity.id,
      name: activity.name,
      description: activity.description,
      responsibleUserId: activity.responsibleUserId ?? '',
      frequency: activity.frequency ?? '',
      scheduleDate: activity.scheduleDate ?? '',
      executionDate: activity.executionDate ?? '',
      objectiveId: activity.objectiveId,
    }));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una actividad existente' })
  @ApiResponse({
    status: 200,
    description: 'La actividad ha sido actualizada correctamente',
    type: ActivityResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateActivityDto: UpdateActivityDto,
  ): Promise<ActivityResponseDto> {
    const activity = await this.updateActivityUseCase.execute({
      id,
      ...updateActivityDto,
    });

    return {
      id: activity.id,
      name: activity.name,
      description: activity.description,
      responsibleUserId: activity.responsibleUserId ?? '',
      frequency: activity.frequency ?? '',
      scheduleDate: activity.scheduleDate ?? '',
      executionDate: activity.executionDate ?? '',
      objectiveId: activity.objectiveId,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una actividad existente' })
  @ApiResponse({
    status: 200,
    description: 'La actividad ha sido eliminada correctamente',
  })
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.deleteActivityUseCase.execute(id);
    return { message: 'La actividad ha sido eliminada correctamente' };
  }
}
