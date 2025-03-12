import { USER_REPOSITORY } from '@/domain/repositories/repositories.providers';
import { IUserRepository } from '@/domain/repositories/user.repository';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

// Definir un tipo para el resultado de los tokens
interface TokenResult {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class GenerateTokensUseCase {
  private readonly logger = new Logger(GenerateTokensUseCase.name);
  private readonly executionLocks = new Map<
    string,
    { timestamp: number; promise: Promise<TokenResult> }
  >();
  private readonly LOCK_TIMEOUT = 5000; // 5 segundos

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject(USER_REPOSITORY)
    private userRepository: IUserRepository,
  ) {}

  async execute(
    id: string,
    email: string,
    roles: string[],
    options?: { generateRefresh?: boolean },
  ): Promise<TokenResult> {
    const lockKey = `token_${id}`;

    // Verificar si ya hay una ejecución en curso para evitar condiciones de carrera
    const existingLock = this.executionLocks.get(lockKey);
    if (
      existingLock &&
      Date.now() - existingLock.timestamp < this.LOCK_TIMEOUT
    ) {
      this.logger.debug(
        `Reutilizando operación en curso para el usuario: ${id}`,
      );
      return existingLock.promise;
    }

    // Crear nueva promesa de ejecución
    const tokenPromise = this._generateTokens(id, email, roles, options);

    // Guardar la promesa en el mapa de bloqueos
    this.executionLocks.set(lockKey, {
      timestamp: Date.now(),
      promise: tokenPromise,
    });

    // Limpiar el bloqueo después de completarse
    tokenPromise.finally(() => {
      setTimeout(() => {
        this.executionLocks.delete(lockKey);
      }, 1000);
    });

    return tokenPromise;
  }

  private async _generateTokens(
    id: string,
    email: string,
    roles: string[],
    options?: { generateRefresh?: boolean },
  ): Promise<TokenResult> {
    try {
      // Si no se solicita explícitamente generar un refresh token, buscamos si ya existe uno
      if (options?.generateRefresh !== true) {
        const user = await this.userRepository.findById(id);

        // Si el usuario existe y ya tiene un refresh token, solo generamos un nuevo access token
        if (user && user.refreshToken) {
          const accessToken = await this.generateAccessTokenOnly(
            id,
            email,
            roles,
          );

          // Obtener el valor original del refresh token almacenado en la cookie (no tenemos acceso directo)
          // Por lo tanto, devolvemos "" para indicar que no se debe actualizar la cookie
          return {
            accessToken,
            refreshToken: '', // No cambiamos el refresh token existente
          };
        }
      }

      // Generar ambos tokens (caso de login inicial o si se solicita explícitamente)
      const { accessToken, refreshToken } = await this.generateBothTokens(
        id,
        email,
        roles,
      );
      const hashedRefreshToken = await argon2.hash(refreshToken);

      // Get the current user with locking to prevent race conditions
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new Error(`User with id ${id} not found`);
      }

      user.refreshToken = hashedRefreshToken;
      await this.userRepository.update(id, user);

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      this.logger.error(`Error generando tokens: ${error.message}`);
      throw error;
    }
  }

  private async generateAccessTokenOnly(
    userId: string,
    email: string,
    roles: string[],
  ): Promise<string> {
    const payload = {
      email: email,
      sub: userId,
      roles: roles,
    };

    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>(
        'JWT_SECRET',
        'hard_to_guess_secret',
      ),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m'),
    });
  }

  private async generateBothTokens(
    userId: string,
    email: string,
    roles: string[],
  ): Promise<TokenResult> {
    const payload = {
      email: email,
      sub: userId,
      roles: roles,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>(
          'JWT_SECRET',
          'hard_to_guess_secret',
        ),
        expiresIn: this.configService.get<string>(
          'JWT_ACCESS_EXPIRES_IN',
          '15m',
        ),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>(
          'JWT_REFRESH_TOKEN_SECRET',
          'hard_to_guess_secret',
        ),
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_TOKEN_EXPIRES_IN',
          '7d',
        ),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
