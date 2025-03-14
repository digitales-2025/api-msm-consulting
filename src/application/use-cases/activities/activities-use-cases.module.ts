import { PersistenceModule } from '@/infrastructure/persistence/persistence.module';
import { Module } from '@nestjs/common';
import { CreateActivityUseCase } from './create-activity.use-case';

@Module({
  imports: [PersistenceModule],
  providers: [CreateActivityUseCase],
  exports: [CreateActivityUseCase],
})
export class ActivitiesUseCasesModule {}
