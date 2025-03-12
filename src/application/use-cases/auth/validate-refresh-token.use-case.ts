import { USER_REPOSITORY } from '@/domain/repositories/repositories.providers';
import { IUserRepository } from '@/domain/repositories/user.repository';
import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class ValidateRefreshTokenUseCase {
  private readonly logger = new Logger(ValidateRefreshTokenUseCase.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: IUserRepository,
  ) {}

  async execute(userId: string, refreshToken: string): Promise<any> {
    try {
      // Obtener el usuario con todas sus propiedades
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      if (!user.refreshToken) {
        throw new UnauthorizedException(
          'No se encontró token de actualización para el usuario',
        );
      }

      // Verificar si el token coincide
      const refreshTokenMatched = await argon2.verify(
        user.refreshToken,
        refreshToken,
      );

      if (!refreshTokenMatched) {
        throw new UnauthorizedException('Token de actualización inválido');
      }

      // Devolver la información completa necesaria del usuario
      return {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        roles: user.roles,
        isActive: user.isActive,
      };
    } catch (error) {
      this.logger.error(`Error validando refresh token: ${error.message}`);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException(
        'Error al validar el token de actualización',
      );
    }
  }
}
