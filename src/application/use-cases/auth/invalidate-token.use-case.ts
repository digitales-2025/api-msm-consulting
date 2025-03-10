import { USER_REPOSITORY } from '@/domain/repositories/repositories.providers';
import { IUserRepository } from '@/domain/repositories/user.repository';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class InvalidateTokensUseCase {
  logger = new Logger('InvalidateTokensUseCase');

  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<void> {
    // Get the current user
    const user = await this.userRepository.findById(userId);
    if (!user) {
      this.logger.error(`User with id ${userId} not found`);
      return;
    }

    // Update only the refresh token
    user.refreshToken = null;
    await this.userRepository.update(userId, user);
  }
}
