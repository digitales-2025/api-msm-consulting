import { Objective } from '@/domain/entities/objective.entity';
import { IObjectiveRepository } from '@/domain/repositories/objective.repository';
import { OBJECTIVE_REPOSITORY } from '@/domain/repositories/repositories.providers';
import { Inject, Injectable } from '@nestjs/common';

interface CreateObjectiveDto {
  name: string;
  description?: string;
  serviceId: string;
  activities?: string[];
}

@Injectable()
export class CreateObjectiveUseCase {
  constructor(
    @Inject(OBJECTIVE_REPOSITORY)
    private readonly objectiveRepository: IObjectiveRepository,
  ) {}

  async execute(createObjectiveDto: CreateObjectiveDto): Promise<Objective> {
    const objective = new Objective({
      id: '',
      name: createObjectiveDto.name,
      description: createObjectiveDto.description || '',
      serviceId: createObjectiveDto.serviceId,
      activities: createObjectiveDto.activities || [],
    });
    return this.objectiveRepository.create(objective);
  }
}
