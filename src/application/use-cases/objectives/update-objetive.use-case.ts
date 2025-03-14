import { Objective } from '@/domain/entities/objective.entity';
import { IObjectiveRepository } from '@/domain/repositories/objective.repository';
import { OBJECTIVE_REPOSITORY } from '@/domain/repositories/repositories.providers';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

interface UpdateObjectiveDTO {
  id: string;
  name?: string;
  description?: string;
  serviceId?: string;
}

@Injectable()
export class UpdateObjectiveUseCase {
  constructor(
    @Inject(OBJECTIVE_REPOSITORY)
    private readonly objectiveRepository: IObjectiveRepository,
  ) {}

  async execute(data: UpdateObjectiveDTO): Promise<Objective> {
    const objective = await this.objectiveRepository.findById(data.id);
    if (!objective) {
      throw new NotFoundException('Objetivo no encontrado');
    }

    const objectiveToUpdate: Partial<Objective> = {};

    if (data.name) {
      objectiveToUpdate.name = data.name;
    }

    if (data.description !== undefined) {
      objectiveToUpdate.description = data.description;
    }

    return this.objectiveRepository.update(data.id, objectiveToUpdate);
  }
}
