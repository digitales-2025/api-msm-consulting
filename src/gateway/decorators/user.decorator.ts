import { User } from '@/domain/entities/user.entity';
import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

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
