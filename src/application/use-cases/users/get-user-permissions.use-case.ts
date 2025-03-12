import { Permission } from '@/domain/entities/permission.entity';
import { IPermissionRepository } from '@/domain/repositories/permission.repository';
import {
  PERMISSION_REPOSITORY,
  USER_REPOSITORY,
} from '@/domain/repositories/repositories.providers';
import { IUserRepository } from '@/domain/repositories/user.repository';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class GetUserPermissionsUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(userId: string): Promise<Permission[]> {
    // Buscar el usuario por ID
    const user = await this.userRepository.findById(userId);

    // Si el usuario no existe, lanzar excepción
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    // Si el usuario no tiene roles, devolver un array vacío
    if (!user.roles || user.roles.length === 0) {
      return [];
    }

    // Obtener todos los permisos del usuario
    return this.permissionRepository.getUserPermissions(userId);
  }
}
