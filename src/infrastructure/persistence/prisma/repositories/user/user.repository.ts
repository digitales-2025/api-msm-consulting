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
    });

    return user ? PrismaUserMapper.toDomain(user) : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user ? PrismaUserMapper.toDomain(user) : null;
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();

    return users.map((user) => PrismaUserMapper.toDomain(user));
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
}
