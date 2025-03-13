import { User } from '@/domain/entities/user.entity';
import {
  ROLE_REPOSITORY,
  USER_REPOSITORY,
} from '@/domain/repositories/repositories.providers';
import { IRoleRepository } from '@/domain/repositories/role.repository';
import { IUserRepository } from '@/domain/repositories/user.repository';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as argon2 from 'argon2';

// Definimos la interfaz para el DTO entrante
interface CreateUserInput {
  email: string;
  password: string;
  fullName: string;
  roleIds?: string[];
  isActive?: boolean;
}

// Lo que realmente necesita la entidad User
type CreateUserRequest = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: IUserRepository,
    @Inject(ROLE_REPOSITORY)
    private roleRepository: IRoleRepository,
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
      roles: [], // Inicialmente sin roles
      isActive: userData.isActive !== undefined ? userData.isActive : true,
      refreshToken: null,
      activities: [],
    };

    // Persistir el usuario
    const createdUser = await this.userRepository.create(userToCreate);

    // Si se proporcionaron IDs de roles, asignarlos al usuario
    if (userData.roleIds && userData.roleIds.length > 0) {
      for (const roleId of userData.roleIds) {
        // Verificar si el rol existe
        const role = await this.roleRepository.findById(roleId);
        if (!role) {
          throw new NotFoundException(`Rol con ID ${roleId} no encontrado`);
        }

        // Asignar el rol al usuario
        await this.userRepository.addRole(createdUser.id, roleId);
      }

      // Recargar el usuario con sus roles
      const updatedUser = await this.userRepository.findById(createdUser.id);
      if (!updatedUser) {
        throw new Error(
          `No se pudo cargar el usuario creado con ID ${createdUser.id}`,
        );
      }
      return updatedUser;
    }

    // Si no se proporcionaron roles, buscar el rol 'user' por defecto
    const defaultRole = await this.roleRepository.findByName('user');
    if (defaultRole) {
      await this.userRepository.addRole(createdUser.id, defaultRole.id);

      // Recargar el usuario con sus roles
      const updatedUser = await this.userRepository.findById(createdUser.id);
      if (!updatedUser) {
        throw new Error(
          `No se pudo cargar el usuario creado con ID ${createdUser.id}`,
        );
      }
      return updatedUser;
    }

    return createdUser;
  }
}
