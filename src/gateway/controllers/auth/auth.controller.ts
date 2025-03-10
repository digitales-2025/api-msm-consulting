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
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({
    status: 200,
    description: 'Devuelve los tokens de acceso y actualización',
    type: AuthResponseDto,
  })
  async login(@Body() signInDto: SignInDto): Promise<AuthResponseDto> {
    const { email, password } = signInDto;

    const user = await this.authenticateUserUseCase.execute(email, password);

    if (!user) {
      return {
        message: 'Credenciales inválidas',
        statusCode: HttpStatus.UNAUTHORIZED,
      };
    }

    const tokens = await this.generateTokensUseCase.execute(
      user.id,
      user.email,
      user.roles,
    );

    // Construimos explícitamente la respuesta para evitar tipos 'any'
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      roles: user.roles,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
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
    description: 'Devuelve un nuevo token de acceso y actualización',
    type: AuthResponseDto,
  })
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponseDto> {
    try {
      // Validar el refresh token
      const user = await this.validateRefreshTokenUseCase.execute(
        refreshTokenDto.refreshToken,
      );

      // Generar nuevos tokens
      const tokens = await this.generateTokensUseCase.execute(
        user.id,
        user.email,
        user.roles,
      );

      // Construimos explícitamente la respuesta para evitar tipos 'any'
      return {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        roles: user.roles,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      this.logger.error(error.message);
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
    description: 'Sesión cerrada exitosamente',
    type: AuthResponseDto,
  })
  async logout(@GetUser('id') userId: string): Promise<AuthResponseDto> {
    await this.invalidateTokensUseCase.execute(userId);

    return {
      message: 'Sesión cerrada exitosamente',
      statusCode: HttpStatus.OK,
    };
  }
}
