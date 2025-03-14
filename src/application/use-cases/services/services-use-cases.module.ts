import { PersistenceModule } from '@/infrastructure/persistence/persistence.module';
import { Module } from '@nestjs/common';
import { CreateServiceUseCase } from './create-service.use-case';
import { DeleteServiceUseCase } from './delete-service.use-case';
import { GetServicesUseCase } from './get-services.use-case';
import { UpdateServiceUseCase } from './update-service.use-case';

@Module({
  imports: [PersistenceModule],
  providers: [
    CreateServiceUseCase,
    GetServicesUseCase,
    UpdateServiceUseCase,
    DeleteServiceUseCase,
  ],
  exports: [
    CreateServiceUseCase,
    GetServicesUseCase,
    UpdateServiceUseCase,
    DeleteServiceUseCase,
  ],
})
export class ServicesUseCasesModule {}
