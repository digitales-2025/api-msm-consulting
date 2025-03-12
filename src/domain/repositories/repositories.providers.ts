import { UserRepository } from '@/infrastructure/persistence/prisma/repositories/user/user.repository';
import { Provider } from '@nestjs/common';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export const REPOSITORIES_PROVIDERS: Provider[] = [
  {
    provide: USER_REPOSITORY,
    useClass: UserRepository,
  },
];
