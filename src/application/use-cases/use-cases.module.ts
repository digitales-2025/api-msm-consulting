import { Module } from '@nestjs/common';
import { AuthUseCasesModule } from './auth/auth-use-cases.module';
import { PermissionsUseCasesModule } from './permissions/permissions-use-cases.module';
import { RolesUseCasesModule } from './roles/roles-use-cases.module';
import { ServicesUserCasesModule } from './services/services-user-cases.module';
import { UsersUseCasesModule } from './users/users-use-cases.module';

@Module({
  imports: [
    AuthUseCasesModule,
    UsersUseCasesModule,
    RolesUseCasesModule,
    PermissionsUseCasesModule,
    ServicesUserCasesModule,
  ],
  exports: [
    AuthUseCasesModule,
    UsersUseCasesModule,
    RolesUseCasesModule,
    PermissionsUseCasesModule,
    ServicesUserCasesModule,
  ],
})
export class UseCasesModule {}
