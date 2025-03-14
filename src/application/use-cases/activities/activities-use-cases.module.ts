import { PersistenceModule } from '@/infrastructure/persistence/persistence.module';
import { Module } from '@nestjs/common';
import { CreateActivityUseCase } from './create-activity.use-case';
import { DeleteActivityUseCase } from './delete-activity.use-case';
import { GetActivitiesByObjectiveIdUseCase } from './get-activities-by-objetive-id.use-case';
import { UpdateActivityUseCase } from './update-activity.use-case';

@Module({
  imports: [PersistenceModule],
  providers: [
    CreateActivityUseCase,
    GetActivitiesByObjectiveIdUseCase,
    UpdateActivityUseCase,
    DeleteActivityUseCase,
  ],
  exports: [
    CreateActivityUseCase,
    GetActivitiesByObjectiveIdUseCase,
    UpdateActivityUseCase,
    DeleteActivityUseCase,
  ],
})
export class ActivitiesUseCasesModule {}
