import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    RolesModule,
    PermissionsModule,
    ServicesModule,
  ],
})
export class ControllersModule {}
