import { PersistenceModule } from '@/infrastructure/persistence/persistence.module';
import { Module } from '@nestjs/common';
import { CreateObjectiveUseCase } from './create-objective.use-case';
import { GetObjectivesByServiceIdUseCase } from './get-objectives-by-service-id.use-case';

@Module({
  imports: [PersistenceModule],
  providers: [CreateObjectiveUseCase, GetObjectivesByServiceIdUseCase],
  exports: [CreateObjectiveUseCase, GetObjectivesByServiceIdUseCase],
})
export class ObjectivesUseCasesModule {}
