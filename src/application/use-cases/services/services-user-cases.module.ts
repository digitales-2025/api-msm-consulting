import { PersistenceModule } from '@/infrastructure/persistence/persistence.module';
import { Module } from '@nestjs/common';
import { CreateServiceUseCase } from './create-service.use-case';
import { GetServicesUseCase } from './get-services.use-case';

@Module({
  imports: [PersistenceModule],
  providers: [CreateServiceUseCase, GetServicesUseCase],
  exports: [CreateServiceUseCase, GetServicesUseCase],
})
export class ServicesUserCasesModule {}
