import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import { UserRepository } from '../../users/repositories/user.repository';

@Injectable()
export class ValidateRefreshTokenUseCase {
  constructor(private userRepository: UserRepository) {}

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
