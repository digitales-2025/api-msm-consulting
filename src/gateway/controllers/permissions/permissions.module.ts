import { PermissionsUseCasesModule } from '@/application/use-cases/permissions/permissions-use-cases.module';
import { PersistenceModule } from '@/infrastructure/persistence/persistence.module';
import { Module } from '@nestjs/common';
import { PermissionsController } from './permissions.controller';

@Module({
  imports: [PermissionsUseCasesModule, PersistenceModule],
  controllers: [PermissionsController],
})
export class PermissionsModule {}
