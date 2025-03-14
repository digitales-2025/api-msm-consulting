import { Module } from '@nestjs/common';
import { AuthUseCasesModule } from './auth/auth-use-cases.module';
import { ObjectivesUseCasesModule } from './objectives/objectives-use-cases.module';
import { PermissionsUseCasesModule } from './permissions/permissions-use-cases.module';
import { RolesUseCasesModule } from './roles/roles-use-cases.module';
import { ServicesUseCasesModule } from './services/services-use-cases.module';
import { UsersUseCasesModule } from './users/users-use-cases.module';

@Module({
  imports: [
    AuthUseCasesModule,
    UsersUseCasesModule,
    RolesUseCasesModule,
    PermissionsUseCasesModule,
    ServicesUseCasesModule,
    ObjectivesUseCasesModule,
  ],
  exports: [
    AuthUseCasesModule,
    UsersUseCasesModule,
    RolesUseCasesModule,
    PermissionsUseCasesModule,
    ServicesUseCasesModule,
    ObjectivesUseCasesModule,
  ],
})
export class UseCasesModule {}
