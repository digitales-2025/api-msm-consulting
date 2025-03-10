import { User } from '@/domain/entities/user.entity';
import { USER_REPOSITORY } from '@/domain/repositories/repositories.providers';
import { IUserRepository } from '@/domain/repositories/user.repository';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

type CreateUserRequest = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: IUserRepository,
  ) {}

  async execute(userData: CreateUserRequest): Promise<User> {
    // Validación de negocio
    const userExists = await this.userRepository.findByEmail(userData.email);
    if (userExists) {
      throw new BadRequestException('El usuario ya existe');
    }

    // Hashear la contraseña (lógica de negocio)
    const hashedPassword = await argon2.hash(userData.password);

    // Crear usuario con la contraseña hasheada
    const userToCreate = {
      ...userData,
      password: hashedPassword,
    };

    // Persistir el usuario
    return this.userRepository.create(userToCreate);
  }
}
