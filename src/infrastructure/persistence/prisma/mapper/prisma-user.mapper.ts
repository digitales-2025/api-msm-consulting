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
    });
    return model;
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      fullName: user.fullName,
      email: user.email,
      password: user.password,
      refreshToken: user.refreshToken,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
