import { PersistenceModule } from '@/infrastructure/persistence/persistence.module';
import { Module } from '@nestjs/common';
import { CreateActivityUseCase } from './create-activity.use-case';
import { GetActivitiesByObjectiveIdUseCase } from './get-activities-by-objetive-id.use-case';

@Module({
  imports: [PersistenceModule],
  providers: [CreateActivityUseCase, GetActivitiesByObjectiveIdUseCase],
  exports: [CreateActivityUseCase, GetActivitiesByObjectiveIdUseCase],
})
export class ActivitiesUseCasesModule {}
