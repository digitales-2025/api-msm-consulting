import { PersistenceModule } from '@/infrastructure/persistence/persistence.module';
import { Module } from '@nestjs/common';
import { CreatePermissionUseCase } from './create-permission.use-case';

@Module({
  imports: [PersistenceModule],
  providers: [CreatePermissionUseCase],
  exports: [CreatePermissionUseCase],
})
export class PermissionsUseCasesModule {}
