import { Activity } from '@/domain/entities/activity.entity';
import { IActivityRepository } from '@/domain/repositories/activity.repository';
import { ACTIVITY_REPOSITORY } from '@/domain/repositories/repositories.providers';
import { Inject, Injectable } from '@nestjs/common';

interface CreateActivityDto {
  name: string;
  description?: string;
  responsibleUserId?: string;
  frequency?: string;
  scheduleDate?: string;
  executionDate?: string;
  objectiveId?: string;
}

@Injectable()
export class CreateActivityUseCase {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: IActivityRepository,
  ) {}

  async execute(createActivityDto: CreateActivityDto): Promise<Activity> {
    const activity = new Activity({
      id: '',
      name: createActivityDto.name,
      description: createActivityDto.description || '',
      isActive: true,
      responsibleUserId: createActivityDto.responsibleUserId || '',
      frequency: createActivityDto.frequency || '',
      scheduleDate: createActivityDto.scheduleDate || '',
      executionDate: createActivityDto.executionDate || '',
      objectiveId: createActivityDto.objectiveId || '',
    });
    return this.activityRepository.create(activity);
  }
}
