import { IObjectiveRepository } from '@/domain/repositories/objective.repository';
import { OBJECTIVE_REPOSITORY } from '@/domain/repositories/repositories.providers';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class DeleteObjectiveUseCase {
  constructor(
    @Inject(OBJECTIVE_REPOSITORY)
    private readonly objectiveRepository: IObjectiveRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const objective = await this.objectiveRepository.findById(id);
    if (!objective) {
      throw new NotFoundException('Objetivo no encontrado');
    }
    await this.objectiveRepository.delete(id);
  }
}
