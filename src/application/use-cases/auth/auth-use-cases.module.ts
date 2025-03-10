import { RepositoriesModule } from '@/domain/repositories/repositories.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticateUserUseCase } from './auth-users.use-case';
import { GenerateTokensUseCase } from './generate-token.use-case';
import { InvalidateTokensUseCase } from './invalidate-token.use-case';
import { ValidateRefreshTokenUseCase } from './validate-refresh-token.use-case';

@Module({
  imports: [RepositoriesModule, JwtModule, ConfigModule],
  providers: [
    AuthenticateUserUseCase,
    GenerateTokensUseCase,
    InvalidateTokensUseCase,
    ValidateRefreshTokenUseCase,
  ],
  exports: [
    AuthenticateUserUseCase,
    GenerateTokensUseCase,
    InvalidateTokensUseCase,
    ValidateRefreshTokenUseCase,
  ],
})
export class AuthUseCasesModule {}
