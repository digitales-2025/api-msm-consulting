import {
  ROLE_REPOSITORY,
  USER_REPOSITORY,
} from '@/domain/repositories/repositories.providers';
import { IRoleRepository } from '@/domain/repositories/role.repository';
import { IUserRepository } from '@/domain/repositories/user.repository';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

interface AssignRoleToUserDTO {
  userId: string;
  roleId: string;
}

@Injectable()
export class AssignRoleToUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: IUserRepository,
    @Inject(ROLE_REPOSITORY)
    private roleRepository: IRoleRepository,
  ) {}

  async execute(data: AssignRoleToUserDTO): Promise<void> {
    // Verificar si el usuario existe
    const user = await this.userRepository.findById(data.userId);
    if (!user) {
      throw new NotFoundException(
        `Usuario con ID "${data.userId}" no encontrado`,
      );
    }

    // Verificar si el rol existe
    const role = await this.roleRepository.findById(data.roleId);
    if (!role) {
      throw new NotFoundException(`Rol con ID "${data.roleId}" no encontrado`);
    }

    // Verificar si el usuario ya tiene este rol
    const userRoles = await this.roleRepository.getUserRoles(data.userId);
    const hasRole = userRoles.some((r) => r.id === data.roleId);

    if (hasRole) {
      // Si ya tiene el rol, no hacemos nada
      return;
    }

    // Asignar el rol al usuario
    await this.userRepository.addRole(data.userId, data.roleId);
  }
}
