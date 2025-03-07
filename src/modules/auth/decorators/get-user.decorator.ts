import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from 'src/modules/users/entities/user.entity';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): Partial<User> => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) throw new InternalServerErrorException('User not found');

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
