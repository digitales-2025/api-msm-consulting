import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma/prisma.service';
import { UserMapper } from '../../shared/mappers/user-mapper';
import { UserRepository } from './repositories/user.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserRepository, PrismaService, UserMapper],
  exports: [UserRepository], // Exportamos para que otros módulos puedan usarlo
})
export class UsersModule {}
