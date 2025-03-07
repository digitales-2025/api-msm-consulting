import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../../../shared/database/prisma/prisma.service';
import { UserMapper } from '../../../shared/mappers/user-mapper';
import { IUserRepository } from '../interfaces/user-repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    private prisma: PrismaService,
    private userMapper: UserMapper,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user ? this.userMapper.toDomain(user) : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user ? this.userMapper.toDomain(user) : null;
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user) => this.userMapper.toDomain(user));
  }

  async findByRefreshToken(hashedToken: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { refreshToken: hashedToken },
    });

    return user ? this.userMapper.toDomain(user) : null;
  }

  async create(
    userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<User> {
    const data = this.userMapper.toPersistence(userData);

    const user = await this.prisma.user.create({
      data,
    });

    return this.userMapper.toDomain(user);
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    const data = this.userMapper.toPersistence(userData);

    const user = await this.prisma.user.update({
      where: { id },
      data,
    });

    return this.userMapper.toDomain(user);
  }
}
