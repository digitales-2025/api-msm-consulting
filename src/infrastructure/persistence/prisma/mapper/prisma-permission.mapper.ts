import { Permission } from '@/domain/entities/permission.entity';
import { Prisma, Permission as PrismaPermission } from '@prisma/client';

export class PrismaPermissionMapper {
  static toDomain(entity: PrismaPermission): Permission {
    return new Permission({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      resource: entity.resource,
      action: entity.action,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toPrisma(
    permission: Permission,
  ): Prisma.PermissionUncheckedCreateInput {
    return {
      id: permission.id,
      name: permission.name,
      description: permission.description,
      resource: permission.resource,
      action: permission.action,
      createdAt: permission.createdAt,
      updatedAt: permission.updatedAt,
    };
  }
}
