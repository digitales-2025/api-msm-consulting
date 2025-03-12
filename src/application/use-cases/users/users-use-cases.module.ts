import { RepositoriesModule } from '@/domain/repositories/repositories.module';
import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './create-user.use-case';
import { FindAllUsersUseCase } from './find-all-users.use-case';
import { FindUserByIdUseCase } from './find-user-by-id.use-case';
import { UpdateUserUseCase } from './update-user.use-case';

@Module({
  imports: [RepositoriesModule],
  providers: [
    CreateUserUseCase,
    FindAllUsersUseCase,
    FindUserByIdUseCase,
    UpdateUserUseCase,
  ],
  exports: [
    CreateUserUseCase,
    FindAllUsersUseCase,
    FindUserByIdUseCase,
    UpdateUserUseCase,
  ],
})
export class UsersUseCasesModule {}
