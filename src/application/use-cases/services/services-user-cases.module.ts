import { PersistenceModule } from '@/infrastructure/persistence/persistence.module';
import { Module } from '@nestjs/common';
import { CreateServiceUseCase } from './create-service.use-case';

@Module({
  imports: [PersistenceModule],
  providers: [CreateServiceUseCase],
  exports: [CreateServiceUseCase],
})
export class ServicesUserCasesModule {}
