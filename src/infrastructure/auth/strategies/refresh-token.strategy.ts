import { UserRepository } from '@/infrastructure/persistence/prisma/repositories/user/user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req.cookies?.refresh_token as string | null;
        },
      ]),
      secretOrKey: configService.get<string>(
        'JWT_REFRESH_SECRET',
        'hard_to_guess_refresh_secret',
      ),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { id: string }) {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    const user = await this.userRepository.findByRefreshToken(
      refreshToken as string,
    );

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User is not active');
    }

    return { ...payload, refreshToken };
  }
}
