import { Role } from '@/domain/entities/role.entity';
import { IRoleRepository } from '@/domain/repositories/role.repository';
import { PrismaRoleMapper } from '@/infrastructure/persistence/prisma/mapper/prisma-role.mapper';
import { PrismaService } from '@/infrastructure/persistence/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RoleRepository implements IRoleRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Role[]> {
    const roles = await this.prisma.role.findMany();
    return roles.map((role) => PrismaRoleMapper.toDomain(role));
  }

  async findById(id: string): Promise<Role | null> {
    const role = await this.prisma.role.findUnique({
      where: { id },
    });

    return role ? PrismaRoleMapper.toDomain(role) : null;
  }

  async findByName(name: string): Promise<Role | null> {
    const role = await this.prisma.role.findUnique({
      where: { name },
    });

    return role ? PrismaRoleMapper.toDomain(role) : null;
  }

  async create(role: Role): Promise<Role> {
    const { id: _id, ...roleData } = role;

    const createdRole = await this.prisma.role.create({
      data: roleData,
    });

    return PrismaRoleMapper.toDomain(createdRole);
  }

  async update(id: string, roleData: Partial<Role>): Promise<Role> {
    const { id: _id, ...data } = roleData;

    const updatedRole = await this.prisma.role.update({
      where: { id },
      data,
    });

    return PrismaRoleMapper.toDomain(updatedRole);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.role.delete({
      where: { id },
    });
  }

  async addPermission(roleId: string, permissionId: string): Promise<void> {
    await this.prisma.rolePermission.create({
      data: {
        roleId,
        permissionId,
      },
    });
  }

  async removePermission(roleId: string, permissionId: string): Promise<void> {
    await this.prisma.rolePermission.delete({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId,
        },
      },
    });
  }

  async getPermissions(roleId: string): Promise<string[]> {
    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: { roleId },
      select: { permissionId: true },
    });

    return rolePermissions.map((rp) => rp.permissionId);
  }

  async getUserRoles(userId: string): Promise<Role[]> {
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId },
      include: { role: true },
    });

    return userRoles.map((ur) => PrismaRoleMapper.toDomain(ur.role));
  }
}
