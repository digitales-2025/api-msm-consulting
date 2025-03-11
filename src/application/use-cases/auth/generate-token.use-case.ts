import { USER_REPOSITORY } from '@/domain/repositories/repositories.providers';
import { IUserRepository } from '@/domain/repositories/user.repository';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

@Injectable()
export class GenerateTokensUseCase {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject(USER_REPOSITORY)
    private userRepository: IUserRepository,
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

    // Get the current user
    const user = await this.userRepository.findById(id);
    console.log('🚀 ~ GenerateTokensUseCase ~ user:', user);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    // Update only the refresh token
    user.refreshToken = hashedRefreshToken;
    await this.userRepository.update(id, user);

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
