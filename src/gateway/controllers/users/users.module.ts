import { UsersUseCasesModule } from '@/application/use-cases/users/users-use-cases.module';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';

@Module({
  imports: [UsersUseCasesModule],
  controllers: [UsersController],
})
export class UsersModule {}
