import { Activity } from '@/domain/entities/activity.entity';
import { IActivityRepository } from '@/domain/repositories/activity.repository';
import { ACTIVITY_REPOSITORY } from '@/domain/repositories/repositories.providers';
import { Inject } from '@nestjs/common';

import { Injectable } from '@nestjs/common';

@Injectable()
export class GetActivitiesByObjectiveIdUseCase {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: IActivityRepository,
  ) {}

  async execute(objectiveId: string) {
    const activities =
      await this.activityRepository.findByObjectiveId(objectiveId);
    return activities.map((activity) => new Activity(activity));
  }
}
