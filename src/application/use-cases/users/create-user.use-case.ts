import { User } from '@/domain/entities/user.entity';
import { USER_REPOSITORY } from '@/domain/repositories/repositories.providers';
import { IUserRepository } from '@/domain/repositories/user.repository';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

// Definimos la interfaz para el DTO entrante
interface CreateUserInput {
  email: string;
  password: string;
  fullName: string;
  roles: string[];
  isActive?: boolean;
}

// Lo que realmente necesita la entidad User
type CreateUserRequest = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: IUserRepository,
  ) {}

  async execute(userData: CreateUserInput): Promise<User> {
    // Validación de negocio
    const userExists = await this.userRepository.findByEmail(userData.email);
    if (userExists) {
      throw new BadRequestException('El usuario ya existe');
    }

    // Hashear la contraseña (lógica de negocio)
    const hashedPassword = await argon2.hash(userData.password);

    // Completar datos faltantes y crear el objeto completo
    const userToCreate: CreateUserRequest = {
      email: userData.email,
      password: hashedPassword,
      fullName: userData.fullName,
      roles: userData.roles || ['user'],
      isActive: userData.isActive !== undefined ? userData.isActive : true,
      refreshToken: null,
    };

    // Persistir el usuario
    return this.userRepository.create(userToCreate);
  }
}
