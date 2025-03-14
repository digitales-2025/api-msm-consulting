import { ObjectiveRepository } from '@/infrastructure/persistence/prisma/repositories/objective/objective.repository';
import { PermissionRepository } from '@/infrastructure/persistence/prisma/repositories/permission/permission.repository';
import { RoleRepository } from '@/infrastructure/persistence/prisma/repositories/role/role.repository';
import { ServiceRepository } from '@/infrastructure/persistence/prisma/repositories/service/service.repository';
import { UserRepository } from '@/infrastructure/persistence/prisma/repositories/user/user.repository';
import { Provider } from '@nestjs/common';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
export const ROLE_REPOSITORY = Symbol('ROLE_REPOSITORY');
export const PERMISSION_REPOSITORY = Symbol('PERMISSION_REPOSITORY');
export const SERVICE_REPOSITORY = Symbol('SERVICE_REPOSITORY');
export const OBJECTIVE_REPOSITORY = Symbol('OBJECTIVE_REPOSITORY');

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
];
