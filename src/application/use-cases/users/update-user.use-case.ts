import { User } from '@/domain/entities/user.entity';
import { USER_REPOSITORY } from '@/domain/repositories/repositories.providers';
import { IUserRepository } from '@/domain/repositories/user.repository';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: IUserRepository,
  ) {}

  async execute(id: string, userData: Partial<User>): Promise<User> {
    // Verificar que el usuario existe
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Si se está actualizando la contraseña, hashearla
    if (userData.password) {
      userData.password = await argon2.hash(userData.password);
    }

    // Actualizar el usuario
    return this.userRepository.update(id, userData);
  }
}
