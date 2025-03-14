import { Activity } from '@/domain/entities/activity.entity';
import { IActivityRepository } from '@/domain/repositories/activity.repository';
import { IObjectiveRepository } from '@/domain/repositories/objective.repository';
import {
  ACTIVITY_REPOSITORY,
  OBJECTIVE_REPOSITORY,
  USER_REPOSITORY,
} from '@/domain/repositories/repositories.providers';
import { IUserRepository } from '@/domain/repositories/user.repository';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

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
    @Inject(OBJECTIVE_REPOSITORY)
    private readonly objectiveRepository: IObjectiveRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
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

    const objective = await this.objectiveRepository.findById(
      activity.objectiveId,
    );
    if (!objective) {
      throw new NotFoundException('El objetivo no existe');
    }

    const responsibleUser = await this.userRepository.findById(
      activity.responsibleUserId ?? '',
    );
    if (!responsibleUser?.isActive) {
      throw new NotFoundException('El usuario no está activo');
    }

    return this.activityRepository.create(activity);
  }
}
