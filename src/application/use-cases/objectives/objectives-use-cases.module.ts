import { PersistenceModule } from '@/infrastructure/persistence/persistence.module';
import { Module } from '@nestjs/common';
import { CreateObjectiveUseCase } from './create-objective.use-case';
import { DeleteObjectiveUseCase } from './delete-objective.use-case';
import { GetObjectivesByServiceIdUseCase } from './get-objectives-by-service-id.use-case';
import { UpdateObjectiveUseCase } from './update-objetive.use-case';

@Module({
  imports: [PersistenceModule],
  providers: [
    CreateObjectiveUseCase,
    GetObjectivesByServiceIdUseCase,
    UpdateObjectiveUseCase,
    DeleteObjectiveUseCase,
  ],
  exports: [
    CreateObjectiveUseCase,
    GetObjectivesByServiceIdUseCase,
    UpdateObjectiveUseCase,
    DeleteObjectiveUseCase,
  ],
})
export class ObjectivesUseCasesModule {}
