import { USER_REPOSITORY } from '@/domain/repositories/repositories.providers';
import { IUserRepository } from '@/domain/repositories/user.repository';
import { Inject, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: IUserRepository,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  async execute(email: string, password: string): Promise<any | null> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return null;
    }

    const passwordMatches = await argon2.verify(user.password, password);

    if (!passwordMatches) {
      return null;
    }

    // No devolver la contraseña ni el refresh token
    const { password: _, refreshToken: __, ...result } = user;
    return result;
  }
}
