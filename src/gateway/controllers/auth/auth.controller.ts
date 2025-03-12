import { AuthenticateUserUseCase } from '@/application/use-cases/auth/auth-users.use-case';
import { GenerateTokensUseCase } from '@/application/use-cases/auth/generate-token.use-case';
import { InvalidateTokensUseCase } from '@/application/use-cases/auth/invalidate-token.use-case';
import { ValidateRefreshTokenUseCase } from '@/application/use-cases/auth/validate-refresh-token.use-case';
import { Auth } from '@/gateway/decorators/auth.decorator';
import { RefreshAuth } from '@/gateway/decorators/refresh-auth.decorator';
import { GetUser } from '@/gateway/decorators/user.decorator';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { SignInDto } from './dtos/sign-in.dto';

interface RequestWithUser extends Request {
  user: {
    refreshToken: string;
    sub: string;
    [key: string]: any;
  };
}
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
    this.logger.debug('Estableciendo cookies de tokens');
    // Configuración de la cookie para el access token
    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development', // HTTPS en producción
      sameSite: 'strict',
      maxAge: this.getAccessTokenMaxAge(), // Duración del JWT
    });

    // Solo actualizamos la cookie del refresh token si se proporciona uno nuevo
    if (refreshToken) {
      // Configuración de la cookie para el refresh token
      response.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', // HTTPS en producción
        sameSite: 'strict',
        maxAge: this.getRefreshTokenMaxAge(), // Duración más larga
      });
    }
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
    try {
      const { email, password } = signInDto;

      const user = await this.authenticateUserUseCase.execute(email, password);

      if (!user) {
        throw new BadRequestException('Credenciales inválidas');
      }

      // En login siempre generamos ambos tokens (access y refresh)
      const tokens = await this.generateTokensUseCase.execute(
        user.id as string,
        user.email as string,
        user.roles as string[],
        { generateRefresh: true },
      );

      // Establecer cookies con los tokens
      this.setTokenCookies(response, tokens.accessToken, tokens.refreshToken);

      return {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        roles: user.roles,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error processing login');
    }
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
  @RefreshAuth()
  async refreshToken(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponseDto> {
    try {
      const refreshToken = req.user.refreshToken;
      const userId = req.user.sub;

      // Validar el refresh token
      const user = await this.validateRefreshTokenUseCase.execute(
        userId,
        refreshToken,
      );

      // Generar solo un nuevo access token, manteniendo el mismo refresh token
      const tokens = await this.generateTokensUseCase.execute(
        user.id as string,
        user.email as string,
        user.roles as string[],
        { generateRefresh: false },
      );

      // Establecer cookies actualizadas
      // Si refreshToken está vacío, solo se actualizará el access token
      this.setTokenCookies(response, tokens.accessToken, tokens.refreshToken);

      return {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        roles: user.roles,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      this.logger.error(`Error en refresh token: ${error.message}`);
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  @Post('logout')
  @Auth()
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

  @Get('me')
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener información del usuario autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Devuelve la información del usuario autenticado',
    type: AuthResponseDto,
  })
  me(@GetUser() user: any): AuthResponseDto {
    return {
      message: 'Usuario autenticado',
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      roles: user.roles,
      statusCode: HttpStatus.OK,
    };
  }
}
