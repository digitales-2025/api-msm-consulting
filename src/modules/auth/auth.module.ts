import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

// Use cases
import { AuthenticateUserUseCase } from './use-cases/auth.use-case';
import { GenerateTokensUseCase } from './use-cases/generate-token.use-case';
import { InvalidateTokensUseCase } from './use-cases/invalidate-token.use-case';
import { ValidateRefreshTokenUseCase } from './use-cases/validate-refresh-token.use-case';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'hard_to_guess_secret'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    AuthenticateUserUseCase,
    GenerateTokensUseCase,
    ValidateRefreshTokenUseCase,
    InvalidateTokensUseCase,
  ],
  exports: [AuthService],
})
export class AuthModule {}
