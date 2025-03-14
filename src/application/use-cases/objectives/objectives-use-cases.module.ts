import { PersistenceModule } from '@/infrastructure/persistence/persistence.module';
import { Module } from '@nestjs/common';
import { CreateObjectiveUseCase } from './create-objective.use-case';

@Module({
  imports: [PersistenceModule],
  providers: [CreateObjectiveUseCase],
  exports: [CreateObjectiveUseCase],
})
export class ObjectivesUseCasesModule {}
