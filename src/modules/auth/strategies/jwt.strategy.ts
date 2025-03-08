import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { UserRepository } from '../../users/repositories/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userRepository: UserRepository, // Si ya está directamente disponible como proveedor
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: extractJwtFromCookie,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(
        'JWT_SECRET',
        'hard_to_guess_secret',
      ),
    });
  }

  async validate(payload: { sub: string }) {
    const user = await this.userRepository.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }

    const {
      password: _password,
      refreshToken: _refreshToken,
      ...result
    } = user;
    return result;
  }
}

// Helper para extraer JWT de cookies
function extractJwtFromCookie(req: Request): string | null {
  if (req.cookies && req.cookies.access_token) {
    return req.cookies.access_token as string;
  }
  return null;
}
