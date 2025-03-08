import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { UserRepository } from '../../users/repositories/user.repository';

@Injectable()
export class GenerateTokensUseCase {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userRepository: UserRepository,
  ) {}

  async execute(
    id: string,
    email: string,
    roles: string[],
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    // Generar access token
    const accessToken = this.generateAccessToken(id, email, roles);

    // Generar refresh token
    const refreshToken = this.generateRefreshToken();

    // Guardar refresh token hasheado en DB
    const hashedRefreshToken = this.hashToken(refreshToken);
    await this.userRepository.update(id, {
      refreshToken: hashedRefreshToken,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  private generateAccessToken(
    userId: string,
    email: string,
    roles: string[],
  ): string {
    const payload = {
      email: email,
      sub: userId,
      roles: roles,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>(
        'JWT_SECRET',
        'hard_to_guess_secret',
      ),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m'),
    });
  }

  private generateRefreshToken(): string {
    return crypto.randomBytes(40).toString('hex');
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
