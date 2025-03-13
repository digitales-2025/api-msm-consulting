import { Role } from '@/domain/entities/role.entity';
import { Prisma, Role as PrismaRole } from '@prisma/client';

export class PrismaRoleMapper {
  static toDomain(entity: PrismaRole): Role {
    return new Role({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      isActive: entity.isActive !== undefined ? entity.isActive : true,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toPrisma(role: Role): Prisma.RoleUncheckedCreateInput {
    // Excluir permissions para evitar conflicto de tipos con Prisma
    const { permissions: _permissions, ...roleData } = role as any;

    return {
      id: roleData.id || undefined,
      name: roleData.name,
      description: roleData.description,
      isActive: roleData.isActive !== undefined ? roleData.isActive : true,
      createdAt: roleData.createdAt,
      updatedAt: roleData.updatedAt,
    };
  }
}
