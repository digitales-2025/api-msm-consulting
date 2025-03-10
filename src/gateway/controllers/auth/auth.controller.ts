import { AuthenticateUserUseCase } from '@/application/use-cases/auth/auth-users.use-case';
import { GenerateTokensUseCase } from '@/application/use-cases/auth/generate-token.use-case';
import { InvalidateTokensUseCase } from '@/application/use-cases/auth/invalidate-token.use-case';
import { ValidateRefreshTokenUseCase } from '@/application/use-cases/auth/validate-refresh-token.use-case';
import { GetUser } from '@/gateway/decorators/user.decorator';
import { JwtAuthGuard } from '@/gateway/guards/jwt-auth.guard';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { SignInDto } from './dtos/sign-in.dto';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  logger = new Logger('AuthController');
  constructor(
    private readonly authenticateUserUseCase: AuthenticateUserUseCase,
    private readonly generateTokensUseCase: GenerateTokensUseCase,
    private readonly validateRefreshTokenUseCase: ValidateRefreshTokenUseCase,
    private readonly invalidateTokensUseCase: InvalidateTokensUseCase,
    private readonly configService: ConfigService,
  ) {}

  private setTokenCookies(
    response: Response,
    accessToken: string,
    refreshToken: string,
  ): void {
    // Configuración de la cookie para el access token
    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development', // HTTPS en producción
      sameSite: 'strict',
      maxAge: this.getAccessTokenMaxAge(), // Duración del JWT
    });

    // Configuración de la cookie para el refresh token
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development', // HTTPS en producción
      sameSite: 'strict',
      path: '/auth/refresh', // Sólo disponible para el endpoint de refresh
      maxAge: this.getRefreshTokenMaxAge(), // Duración más larga
    });
  }

  private clearTokenCookies(response: Response): void {
    response.cookie('access_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 0,
    });

    response.cookie('refresh_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: 0,
    });
  }

  private getAccessTokenMaxAge(): number {
    const expiresIn = this.configService.get<string>(
      'JWT_ACCESS_EXPIRES_IN',
      '15m',
    );
    // Convertir a milisegundos (por defecto 15 minutos)
    return expiresIn.includes('m')
      ? parseInt(expiresIn.replace('m', '')) * 60 * 1000
      : 15 * 60 * 1000;
  }

  private getRefreshTokenMaxAge(): number {
    const expiresIn = this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_IN',
      '7d',
    );
    // Convertir a milisegundos (por defecto 7 días)
    return expiresIn.includes('d')
      ? parseInt(expiresIn.replace('d', '')) * 24 * 60 * 60 * 1000
      : 7 * 24 * 60 * 60 * 1000;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({
    status: 200,
    description:
      'Devuelve los datos del usuario autenticado y establece cookies para los tokens',
    type: AuthResponseDto,
  })
  async login(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponseDto> {
    const { email, password } = signInDto;

    const user = await this.authenticateUserUseCase.execute(email, password);

    if (!user) {
      return {
        message: 'Credenciales inválidas',
        statusCode: HttpStatus.UNAUTHORIZED,
      };
    }

    const tokens = await this.generateTokensUseCase.execute(
      user.id as string,
      user.email as string,
      user.roles as string[],
    );

    // Establecer cookies con los tokens
    this.setTokenCookies(response, tokens.accessToken, tokens.refreshToken);

    // Devolver solo información del usuario (sin los tokens en el cuerpo)
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      roles: user.roles,
      statusCode: HttpStatus.OK,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Renovar token de acceso usando token de actualización',
  })
  @ApiResponse({
    status: 200,
    description: 'Renueva el token de acceso y actualiza las cookies',
    type: AuthResponseDto,
  })
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponseDto> {
    try {
      // Intentamos usar primero la cookie, luego el cuerpo de la solicitud
      const refreshToken =
        request.cookies?.refresh_token || refreshTokenDto.refreshToken;

      if (!refreshToken) {
        throw new Error('No refresh token provided');
      }

      // Validar el refresh token
      const user = await this.validateRefreshTokenUseCase.execute(
        refreshToken as string,
      );

      // Generar nuevos tokens
      const tokens = await this.generateTokensUseCase.execute(
        user.id as string,
        user.email as string,
        user.roles as string[],
      );

      // Establecer nuevas cookies con los tokens actualizados
      this.setTokenCookies(response, tokens.accessToken, tokens.refreshToken);

      // Devolver solo información del usuario
      return {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        roles: user.roles,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      this.logger.error(error.message);
      // Limpiar cookies en caso de error
      this.clearTokenCookies(response);
      return {
        message: 'Token inválido o expirado',
        statusCode: HttpStatus.UNAUTHORIZED,
      };
    }
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cerrar sesión' })
  @ApiResponse({
    status: 200,
    description: 'Sesión cerrada exitosamente y cookies eliminadas',
    type: AuthResponseDto,
  })
  async logout(
    @GetUser('id') userId: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponseDto> {
    await this.invalidateTokensUseCase.execute(userId);

    // Eliminar las cookies
    this.clearTokenCookies(response);

    return {
      message: 'Sesión cerrada exitosamente',
      statusCode: HttpStatus.OK,
    };
  }
}
