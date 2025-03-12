import { PermissionRepository } from '@/infrastructure/persistence/prisma/repositories/permission/permission.repository';
import { RoleRepository } from '@/infrastructure/persistence/prisma/repositories/role/role.repository';
import { UserRepository } from '@/infrastructure/persistence/prisma/repositories/user/user.repository';
import { Provider } from '@nestjs/common';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
export const ROLE_REPOSITORY = Symbol('ROLE_REPOSITORY');
export const PERMISSION_REPOSITORY = Symbol('PERMISSION_REPOSITORY');

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
