import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../users/repositories/user.repository';

@Injectable()
export class InvalidateTokensUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string): Promise<void> {
    await this.userRepository.update(userId, { refreshToken: null });
  }
}
