import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { SignInDto } from './dto/signin.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  @ApiOperation({ summary: 'Iniciar sesión de usuario' })
  @ApiResponse({
    status: 200,
    description: 'Usuario autenticado correctamente',
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async signin(
    @Body() signinDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = (await this.authService.validateUser(
      signinDto.email,
      signinDto.password,
    )) as User;

    if (!user) {
      throw new UnauthorizedException(
        'Credenciales inválidas. Por favor, verifique su correo electrónico y contraseña e intente nuevamente.',
      );
    }

    await this.authService.signIn(user, response);

    return { user };
  }

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  @HttpCode(HttpStatus.OK)
  async signout(
    @GetUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.signOut(user.id, response);
    return {
      message:
        'Sesión cerrada exitosamente. Ha salido de su cuenta de forma segura.',
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies['refresh_token'] as string;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    await this.authService.refreshTokens(refreshToken, response);
    return { message: 'Token refreshed successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
