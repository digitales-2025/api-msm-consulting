import { USER_REPOSITORY } from '@/domain/repositories/repositories.providers';
import { IUserRepository } from '@/domain/repositories/user.repository';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class ValidateRefreshTokenUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: IUserRepository,
  ) {}

  async execute(refreshToken: string): Promise<any> {
    // Hash del token para compararlo con el almacenado
    const hashedToken = this.hashToken(refreshToken);
    // Buscar usuario con este token
    const user = await this.userRepository.findByRefreshToken(hashedToken);
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const { password: _password, refreshToken: _, ...result } = user;
    return result;
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
