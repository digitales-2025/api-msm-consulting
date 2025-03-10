import { CreateUserUseCase } from '@/application/use-cases/users/create-user.use-case';
import { FindAllUsersUseCase } from '@/application/use-cases/users/find-all-users.use-case';
import { FindUserByIdUseCase } from '@/application/use-cases/users/find-user-by-id.use-case';
import { UpdateUserUseCase } from '@/application/use-cases/users/update-user.use-case';
import { User } from '@/domain/entities/user.entity';
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
  ) {}

  @Get()
  async findAll() {
    return this.findAllUsersUseCase.execute();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.findUserByIdUseCase.execute(id);
  }

  @Post()
  async create(@Body() userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.createUserUseCase.execute(userData);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() userData: Partial<User>) {
    return this.updateUserUseCase.execute(id, userData);
  }
}
