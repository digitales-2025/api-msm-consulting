import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ObjectivesModule } from './objectives/objectives.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { ServicesModule } from './services/services.module';
import { UsersModule } from './users/users.module';
import { ActivitiesModule } from './activities/activities.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    RolesModule,
    PermissionsModule,
    ServicesModule,
    ObjectivesModule,
    ActivitiesModule,
  ],
})
export class ControllersModule {}
