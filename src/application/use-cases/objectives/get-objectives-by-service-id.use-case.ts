import { Objective } from '@/domain/entities/objective.entity';
import { IObjectiveRepository } from '@/domain/repositories/objective.repository';
import { OBJECTIVE_REPOSITORY } from '@/domain/repositories/repositories.providers';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetObjectivesByServiceIdUseCase {
  constructor(
    @Inject(OBJECTIVE_REPOSITORY)
    private readonly objectiveRepository: IObjectiveRepository,
  ) {}

  async execute(serviceId: string): Promise<Objective[]> {
    const objectives =
      await this.objectiveRepository.getObjectivesByServiceId(serviceId);

    return objectives.map(
      (objective) =>
        new Objective({
          id: objective.id,
          name: objective.name,
          description: objective.description,
          serviceId: objective.serviceId,
          activities: objective.activities,
        }),
    );
  }
}
