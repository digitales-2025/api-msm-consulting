import { User } from '@/domain/entities/user.entity';
import { IUserRepository } from '@/domain/repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { PrismaUserMapper } from '../../mapper/prisma-user.mapper';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) return null;

    // Convertir a objeto de dominio y cargar los roles
    const domainUser = PrismaUserMapper.toDomain(user);

    // Asignar los nombres de roles desde la relación
    domainUser.roles = user.roles.map((ur) => ur.role.name);

    return domainUser;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) return null;

    // Convertir a objeto de dominio y cargar los roles
    const domainUser = PrismaUserMapper.toDomain(user);

    // Asignar los nombres de roles desde la relación
    domainUser.roles = user.roles.map((ur) => ur.role.name);

    return domainUser;
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    return users.map((user) => {
      const domainUser = PrismaUserMapper.toDomain(user);
      domainUser.roles = user.roles.map((ur) => ur.role.name);
      return domainUser;
    });
  }

  async findByRefreshToken(hashedToken: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { refreshToken: hashedToken },
    });

    return user ? PrismaUserMapper.toDomain(user) : null;
  }

  async create(user: User): Promise<User> {
    const data = PrismaUserMapper.toPrisma(user);

    const userCreate = await this.prisma.user.create({
      data,
    });

    return PrismaUserMapper.toDomain(userCreate);
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    const data = PrismaUserMapper.toPrisma(userData as User);

    const userUpdate = await this.prisma.user.update({
      where: { id },
      data,
    });

    return PrismaUserMapper.toDomain(userUpdate);
  }

  async addRole(userId: string, roleId: string): Promise<void> {
    await this.prisma.userRole.create({
      data: {
        userId,
        roleId,
      },
    });
  }

  async removeRole(userId: string, roleId: string): Promise<void> {
    await this.prisma.userRole.delete({
      where: {
        userId_roleId: {
          userId,
          roleId,
        },
      },
    });
  }

  async findByRoleId(roleId: string): Promise<User[]> {
    const userRoles = await this.prisma.userRole.findMany({
      where: { roleId },
      include: { user: true },
    });

    return userRoles.map((ur) => PrismaUserMapper.toDomain(ur.user));
  }
}
