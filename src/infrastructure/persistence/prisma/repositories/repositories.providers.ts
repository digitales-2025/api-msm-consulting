import {
  ACTIVITY_REPOSITORY,
  OBJECTIVE_REPOSITORY,
  PERMISSION_REPOSITORY,
  ROLE_REPOSITORY,
  SERVICE_REPOSITORY,
  USER_REPOSITORY,
} from '@/domain/repositories/repositories.providers';
import { Provider } from '@nestjs/common';
import { ActivityRepository } from './activity/activity.repository';
import { ObjectiveRepository } from './objective/objective.repository';
import { PermissionRepository } from './permission/permission.repository';
import { RoleRepository } from './role/role.repository';
import { ServiceRepository } from './service/service.repository';
import { UserRepository } from './user/user.repository';
export const REPOSITORIES_PROVIDERS: Provider[] = [
  {
    provide: USER_REPOSITORY,
    useClass: UserRepository,
  },
  {
    provide: ROLE_REPOSITORY,
    useClass: RoleRepository,
  },
  {
    provide: PERMISSION_REPOSITORY,
    useClass: PermissionRepository,
  },
  {
    provide: SERVICE_REPOSITORY,
    useClass: ServiceRepository,
  },
  {
    provide: OBJECTIVE_REPOSITORY,
    useClass: ObjectiveRepository,
  },
  {
    provide: ACTIVITY_REPOSITORY,
    useClass: ActivityRepository,
  },
];
