import { Module } from '@nestjs/common';
import { AuthUseCasesModule } from './auth/auth-use-cases.module';
import { UsersUseCasesModule } from './users/users-use-cases.module';

@Module({
  imports: [UsersUseCasesModule, AuthUseCasesModule],
  exports: [UsersUseCasesModule, AuthUseCasesModule],
})
export class UseCasesModule {}
