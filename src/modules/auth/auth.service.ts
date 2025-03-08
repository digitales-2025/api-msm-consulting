import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { User } from '../users/entities/user.entity';
import { IAuthService } from './interfaces/auth-service.interface';
import { AuthenticateUserUseCase } from './use-cases/auth.use-case';
import { GenerateTokensUseCase } from './use-cases/generate-token.use-case';
import { InvalidateTokensUseCase } from './use-cases/invalidate-token.use-case';
import { ValidateRefreshTokenUseCase } from './use-cases/validate-refresh-token.use-case';

@Injectable()
export class AuthService implements IAuthService {
  logger = new Logger('AuthService');
  constructor(
    private configService: ConfigService,
    private authenticateUserUseCase: AuthenticateUserUseCase,
    private generateTokensUseCase: GenerateTokensUseCase,
    private validateRefreshTokenUseCase: ValidateRefreshTokenUseCase,
    private invalidateTokensUseCase: InvalidateTokensUseCase,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    return this.authenticateUserUseCase.execute(email, password);
  }

  async signIn(user: User, response: Response): Promise<void> {
    const tokens = await this.generateTokensUseCase.execute(
      user.id,
      user.email,
      user.roles,
    );

    this.setTokenCookies(response, tokens.accessToken, tokens.refreshToken);
  }

  async signOut(userId: string, response: Response): Promise<void> {
    await this.invalidateTokensUseCase.execute(userId);
    this.clearTokenCookies(response);
  }

  async refreshTokens(refreshToken: string, response: Response): Promise<void> {
    try {
      const user = await this.validateRefreshTokenUseCase.execute(refreshToken);

      const tokens = await this.generateTokensUseCase.execute(
        user.id as string,
        user.email as string,
        user.roles as string[],
      );

      this.setTokenCookies(response, tokens.accessToken, tokens.refreshToken);
    } catch (error) {
      this.logger.error(error.message);
      this.clearTokenCookies(response);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private setTokenCookies(
    response: Response,
    accessToken: string,
    refreshToken: string,
  ): void {
    // Access token cookie
    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: this.parseExpirationToMs(
        this.configService.get('JWT_ACCESS_EXPIRES_IN', '15m'),
      ),
      path: '/',
    });

    // Refresh token cookie
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: this.parseExpirationToMs(
        this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
      ),
      path: '/auth/refresh',
    });
  }

  private clearTokenCookies(response: Response): void {
    response.clearCookie('access_token');
    response.clearCookie('refresh_token', { path: '/auth/refresh' });
  }

  private parseExpirationToMs(expiration: string): number {
    const match = expiration.match(/^(\d+)([smhd])$/);
    if (!match) return 3600000;

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value * 1000;
      case 'm':
        return value * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      default:
        return 3600000;
    }
  }
}
