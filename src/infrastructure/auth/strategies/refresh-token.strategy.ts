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
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req.cookies?.refresh_token as string;
        },
      ]),
      secretOrKey: configService.get<string>(
        'JWT_REFRESH_TOKEN_SECRET',
        'hard_to_guess_secret',
      ),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { sub: string }) {
    const refreshToken = req.cookies?.refresh_token; // Extraer el refresh token de la cookie
    // 1. Verificación: El refresh token existe
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    // 2. Verificar que el usuario existe
    const user = await this.userRepository.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // 3. Verificar que el usuario está activo
    if (!user.isActive) {
      throw new UnauthorizedException(
        'User is not active, talk to the administrator',
      );
    }

    // Devolvemos los datos del usuario y el token para que puedan ser utilizados en el servicio de autenticación
    return { ...payload, refreshToken };
  }
}
