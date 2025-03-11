import { USER_REPOSITORY } from '@/domain/repositories/repositories.providers';
import { IUserRepository } from '@/domain/repositories/user.repository';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

@Injectable()
export class GenerateTokensUseCase {
  private readonly logger = new Logger(GenerateTokensUseCase.name);

  // Caché para prevenir ejecuciones duplicadas
  private executionLocks: Map<
    string,
    {
      timestamp: number;
      promise: Promise<{
        accessToken: string;
        refreshToken: string;
      }>;
    }
  > = new Map();
  private readonly LOCK_TIMEOUT = 2000; // 2 segundos

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject(USER_REPOSITORY)
    private userRepository: IUserRepository,
  ) {
    // Limpieza periódica de bloqueos antiguos
    setInterval(() => this.cleanupLocks(), 30000);
  }

  private cleanupLocks(): void {
    const now = Date.now();
    this.executionLocks.forEach((value, key) => {
      if (now - value.timestamp > this.LOCK_TIMEOUT) {
        this.executionLocks.delete(key);
      }
    });
  }

  async execute(
    id: string,
    email: string,
    roles: string[],
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const lockKey = `token_${id}`;
    const executionId = Date.now().toString().slice(-6);

    this.logger.log(
      `⚠️ [${executionId}] Intento de generar tokens para: ${id}`,
    );

    // Si ya hay una ejecución en curso para este usuario, usar esa
    const existingLock = this.executionLocks.get(lockKey);
    if (
      existingLock &&
      Date.now() - existingLock.timestamp < this.LOCK_TIMEOUT
    ) {
      this.logger.log(
        `🔒 [${executionId}] Reusando promesa existente para: ${id}`,
      );
      return existingLock.promise;
    }

    // Crear nueva promesa de ejecución
    const tokenPromise = this._generateTokens(id, email, roles, executionId);

    // Guardar la promesa en el mapa de bloqueos
    this.executionLocks.set(lockKey, {
      timestamp: Date.now(),
      promise: tokenPromise,
    });

    // Limpiar el bloqueo después de completarse
    tokenPromise.finally(() => {
      setTimeout(() => {
        this.executionLocks.delete(lockKey);
      }, this.LOCK_TIMEOUT);
    });

    return tokenPromise;
  }

  // Método interno real que genera los tokens
  private async _generateTokens(
    id: string,
    email: string,
    roles: string[],
    executionId: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    try {
      this.logger.log(`📝 [${executionId}] Generando tokens para: ${id}`);

      // Generar access token
      const accessToken = this.generateAccessToken(id, email, roles);

      // Generar refresh token
      const refreshToken = this.generateRefreshToken();
      this.logger.log(
        `🔑 [${executionId}] Token generado: ${refreshToken.substring(0, 8)}...`,
      );

      // Guardar refresh token hasheado en DB
      const hashedRefreshToken = this.hashToken(refreshToken);
      this.logger.log(
        `💾 [${executionId}] Hash guardado: ${hashedRefreshToken.substring(0, 8)}...`,
      );

      // Get the current user
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new Error(`User with id ${id} not found`);
      }

      // Update only the refresh token
      user.refreshToken = hashedRefreshToken;
      await this.userRepository.update(id, user);

      this.logger.log(
        `✅ [${executionId}] Tokens generados correctamente para: ${id}`,
      );

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      this.logger.error(
        `❌ [${executionId}] Error generando tokens: ${error.message}`,
      );
      throw error;
    }
  }

  // Métodos existentes sin cambios
  private generateAccessToken(
    userId: string,
    email: string,
    roles: string[],
  ): string {
    const payload = {
      email: email,
      sub: userId,
      roles: roles,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>(
        'JWT_SECRET',
        'hard_to_guess_secret',
      ),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m'),
    });
  }

  private generateRefreshToken(): string {
    return crypto.randomBytes(40).toString('hex');
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
