import { AuthUseCasesModule } from '@/application/use-cases/auth/auth-use-cases.module';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';

@Module({
  imports: [AuthUseCasesModule],
  controllers: [AuthController],
})
export class AuthModule {}
