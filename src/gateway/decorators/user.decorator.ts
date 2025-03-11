import { User } from '@/domain/entities/user.entity';
import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) throw new InternalServerErrorException('User not found');

    // Si se especifica un atributo, devolver solo ese atributo
    if (data) {
      // Verificar si el atributo existe
      if (!(data in user)) {
        throw new InternalServerErrorException(
          `User attribute ${data} not found`,
        );
      }
      return user[data] as User;
    }

    // Si no se especifica atributo, devolver el objeto de usuario parcial
    return {
      id: user.id,
      email: user.email,
      roles: user.roles,
      fullName: user.fullName,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  },
);
