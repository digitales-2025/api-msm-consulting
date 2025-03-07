import { Injectable } from '@nestjs/common';
import { User } from '../../modules/users/entities/user.entity';

@Injectable()
export class UserMapper {
  toDomain(prismaUser: any): User {
    const user = new User();

    // Propiedades base
    user.id = prismaUser.id;
    user.email = prismaUser.email;
    user.password = prismaUser.password;
    user.fullName = prismaUser.fullName || '';
    user.roles = prismaUser.roles || ['user'];
    user.refreshToken = prismaUser.refreshToken;
    user.createdAt = prismaUser.createdAt;
    user.updatedAt = prismaUser.updatedAt;

    // Mapeo dinámico de propiedades adicionales
    Object.keys(prismaUser).forEach((key) => {
      if (
        ![
          'id',
          'email',
          'password',
          'fullName',
          'roles',
          'refreshToken',
          'createdAt',
          'updatedAt',
        ].includes(key)
      ) {
        user[key] = prismaUser[key];
      }
    });

    return user;
  }

  toPersistence(user: Partial<User>): any {
    const prismaUser: any = {};

    // Solo incluir propiedades que existen
    if (user.email !== undefined) prismaUser.email = user.email;
    if (user.password !== undefined) prismaUser.password = user.password;
    if (user.fullName !== undefined) prismaUser.fullName = user.fullName;
    if (user.roles !== undefined) prismaUser.roles = user.roles;
    if (user.refreshToken !== undefined)
      prismaUser.refreshToken = user.refreshToken;

    // Mapear propiedades adicionales
    Object.keys(user).forEach((key) => {
      if (
        ![
          'id',
          'email',
          'password',
          'fullName',
          'roles',
          'refreshToken',
          'createdAt',
          'updatedAt',
        ].includes(key)
      ) {
        prismaUser[key] = user[key];
      }
    });

    return prismaUser;
  }
}
