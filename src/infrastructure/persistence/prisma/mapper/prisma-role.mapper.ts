import { Role } from '@/domain/entities/role.entity';
import { Prisma, Role as PrismaRole } from '@prisma/client';

export class PrismaRoleMapper {
  static toDomain(entity: PrismaRole): Role {
    return new Role({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toPrisma(role: Role): Prisma.RoleUncheckedCreateInput {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }
}
