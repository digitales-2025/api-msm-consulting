import { Activity } from '@/domain/entities/activity.entity';
import { IActivityRepository } from '@/domain/repositories/activity.repository';
import { ACTIVITY_REPOSITORY } from '@/domain/repositories/repositories.providers';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

interface UpdateActivityDTO {
  id: string;
  name?: string;
  description?: string;
  responsibleUserId?: string;
  frequency?: string;
  scheduleDate?: string;
  executionDate?: string;
}

@Injectable()
export class UpdateActivityUseCase {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: IActivityRepository,
  ) {}

  async execute(data: UpdateActivityDTO): Promise<Activity> {
    const activity = await this.activityRepository.findById(data.id);
    if (!activity) {
      throw new NotFoundException('Actividad no encontrada');
    }

    const activityToUpdate: Partial<Activity> = {};

    if (data.name) {
      activityToUpdate.name = data.name;
    }

    if (data.description !== undefined) {
      activityToUpdate.description = data.description;
    }

    if (data.responsibleUserId !== undefined) {
      activityToUpdate.responsibleUserId = data.responsibleUserId;
    }

    if (data.frequency !== undefined) {
      activityToUpdate.frequency = data.frequency;
    }

    if (data.scheduleDate !== undefined) {
      activityToUpdate.scheduleDate = data.scheduleDate;
    }

    if (data.executionDate !== undefined) {
      activityToUpdate.executionDate = data.executionDate;
    }

    return this.activityRepository.update(data.id, activityToUpdate);
  }
}
