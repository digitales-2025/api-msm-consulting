import { AuthUseCasesModule } from '@/application/use-cases/auth/auth-use-cases.module';
import { AuthModule as InfraAuthModule } from '@/infrastructure/auth/auth.module';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';

@Module({
  imports: [AuthUseCasesModule, InfraAuthModule],
  controllers: [AuthController],
})
export class AuthModule {}
