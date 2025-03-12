import { Permission } from '@/domain/entities/permission.entity';
import { IPermissionRepository } from '@/domain/repositories/permission.repository';
import { PrismaPermissionMapper } from '@/infrastructure/persistence/prisma/mapper/prisma-permission.mapper';
import { PrismaService } from '@/infrastructure/persistence/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PermissionRepository implements IPermissionRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Permission[]> {
    const permissions = await this.prisma.permission.findMany();
    return permissions.map((permission) =>
      PrismaPermissionMapper.toDomain(permission),
    );
  }

  async findById(id: string): Promise<Permission | null> {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
    });

    return permission ? PrismaPermissionMapper.toDomain(permission) : null;
  }

  async findByName(name: string): Promise<Permission | null> {
    const permission = await this.prisma.permission.findUnique({
      where: { name },
    });

    return permission ? PrismaPermissionMapper.toDomain(permission) : null;
  }

  async findByResourceAndAction(
    resource: string,
    action: string,
  ): Promise<Permission | null> {
    const permission = await this.prisma.permission.findFirst({
      where: {
        resource,
        action,
      },
    });

    return permission ? PrismaPermissionMapper.toDomain(permission) : null;
  }

  async create(permission: Permission): Promise<Permission> {
    const { id: _id, ...permissionData } = permission;

    const createdPermission = await this.prisma.permission.create({
      data: permissionData,
    });

    return PrismaPermissionMapper.toDomain(createdPermission);
  }

  async update(
    id: string,
    permissionData: Partial<Permission>,
  ): Promise<Permission> {
    const { id: _id, ...data } = permissionData;

    const updatedPermission = await this.prisma.permission.update({
      where: { id },
      data,
    });

    return PrismaPermissionMapper.toDomain(updatedPermission);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.permission.delete({
      where: { id },
    });
  }

  async getRolePermissions(roleId: string): Promise<Permission[]> {
    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: { roleId },
      include: { permission: true },
    });

    return rolePermissions.map((rp) =>
      PrismaPermissionMapper.toDomain(rp.permission),
    );
  }

  async getUserPermissions(userId: string): Promise<Permission[]> {
    // Obtener todos los roles del usuario
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId },
      select: { roleId: true },
    });

    if (userRoles.length === 0) {
      return [];
    }

    // Obtener todos los permisos asociados a esos roles
    const roleIds = userRoles.map((ur) => ur.roleId);
    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: {
        roleId: {
          in: roleIds,
        },
      },
      include: { permission: true },
    });

    // Eliminar duplicados de permisos si hay varios roles con los mismos permisos
    const uniquePermissions = new Map<string, any>();
    rolePermissions.forEach((rp) => {
      uniquePermissions.set(rp.permission.id, rp.permission);
    });

    return Array.from(uniquePermissions.values()).map((permission) =>
      PrismaPermissionMapper.toDomain(permission),
    );
  }
}
