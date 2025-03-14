import { CreateActivityUseCase } from '@/application/use-cases/activities/create-activity.use-case';
import { GetActivitiesByObjectiveIdUseCase } from '@/application/use-cases/activities/get-activities-by-objetive-id.use-case';
import { Auth } from '@/gateway/decorators/auth.decorator';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ActivityResponseDto } from './dtos/activity-response.dto';
import { CreateActivityDto } from './dtos/create-activity.dto';

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

  @Get(':objectiveId')
  @ApiOperation({ summary: 'Obtener actividades por objetivo' })
  @ApiResponse({
    status: 200,
    description: 'Las actividades han sido obtenidas correctamente',
    type: ActivityResponseDto,
  })
  async getActivitiesByObjectiveId(
    @Param('objectiveId') objectiveId: string,
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
}
