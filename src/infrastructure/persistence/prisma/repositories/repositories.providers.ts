import {
  PERMISSION_REPOSITORY,
  ROLE_REPOSITORY,
  USER_REPOSITORY,
} from '@/domain/repositories/repositories.providers';
import { Provider } from '@nestjs/common';
import { PermissionRepository } from './permission/permission.repository';
import { RoleRepository } from './role/role.repository';
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
];
