import { CreateActivityUseCase } from '@/application/use-cases/activities/create-activity.use-case';
import { Auth } from '@/gateway/decorators/auth.decorator';
import { Body, Controller, Post } from '@nestjs/common';
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
  constructor(private readonly createActivityUseCase: CreateActivityUseCase) {}

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
}
