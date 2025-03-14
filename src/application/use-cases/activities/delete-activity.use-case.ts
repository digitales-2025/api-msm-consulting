import { IActivityRepository } from '@/domain/repositories/activity.repository';
import { ACTIVITY_REPOSITORY } from '@/domain/repositories/repositories.providers';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class DeleteActivityUseCase {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: IActivityRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const activity = await this.activityRepository.findById(id);
    if (!activity) {
      throw new NotFoundException('Actividad no encontrada');
    }
    await this.activityRepository.delete(id);
  }
}
