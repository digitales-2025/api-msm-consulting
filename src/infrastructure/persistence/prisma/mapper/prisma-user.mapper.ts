import { User } from '@/domain/entities/user.entity';
import { Prisma, User as PrismaUser } from '@prisma/client';

export class PrismaUserMapper {
  static toDomain(entity: PrismaUser): User {
    const model = new User({
      id: entity.id,
      fullName: entity.fullName,
      email: entity.email,
      password: entity.password,
      roles: [],
      refreshToken: entity.refreshToken,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      activities: [],
    });
    return model;
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    const { activities, ...userData } = user;

    const result: Prisma.UserUncheckedCreateInput = {
      fullName: userData.fullName,
      email: userData.email,
      password: userData.password,
      refreshToken: userData.refreshToken,
      isActive: userData.isActive,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    };

    // Solo agregar activities si existe y tiene elementos
    if (activities && activities.length > 0) {
      result.activities = {
        connect: activities.map((activity) => ({ id: activity })),
      };
    }

    return result;
  }
}
