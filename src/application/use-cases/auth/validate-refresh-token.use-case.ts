import { USER_REPOSITORY } from '@/domain/repositories/repositories.providers';
import { IUserRepository } from '@/domain/repositories/user.repository';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { verify } from 'argon2';

@Injectable()
export class ValidateRefreshTokenUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: IUserRepository,
  ) {}

  async execute(userId: string, refreshToken: string): Promise<any> {
    console.log(
      '🚀 ~ ValidateRefreshTokenUseCase ~ execute ~ refreshToken:',
      refreshToken,
    );

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.refreshToken) {
      throw new UnauthorizedException('No refresh token found for user');
    }

    const refreshTokenMatched = await verify(user.refreshToken, refreshToken);

    // Buscar usuario con este token
    if (!refreshTokenMatched)
      throw new UnauthorizedException('Invalid Refresh Token!');

    const currentUser = { id: user.id };
    return currentUser;
  }
}
