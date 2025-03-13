import { IPermissionRepository } from '@/domain/repositories/permission.repository';
import {
  PERMISSION_REPOSITORY,
  ROLE_REPOSITORY,
} from '@/domain/repositories/repositories.providers';
import { IRoleRepository } from '@/domain/repositories/role.repository';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

interface AssignPermissionToRoleDTO {
  roleId: string;
  permissionId: string;
}

@Injectable()
export class AssignPermissionToRoleUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private roleRepository: IRoleRepository,
    @Inject(PERMISSION_REPOSITORY)
    private permissionRepository: IPermissionRepository,
  ) {}

  async execute(data: AssignPermissionToRoleDTO): Promise<void> {
    // Verificar si el rol existe
    const role = await this.roleRepository.findById(data.roleId);
    if (!role) {
      throw new NotFoundException(`Rol con ID "${data.roleId}" no encontrado`);
    }

    // Verificar si el permiso existe
    const permission = await this.permissionRepository.findById(
      data.permissionId,
    );
    if (!permission) {
      throw new NotFoundException(
        `Permiso con ID "${data.permissionId}" no encontrado`,
      );
    }

    // Verificar si el permiso ya está asignado al rol
    const rolePermissions = await this.roleRepository.getPermissions(
      data.roleId,
    );
    if (rolePermissions.includes(data.permissionId)) {
      // Si ya está asignado, no hacemos nada
      return;
    }

    // Asignar el permiso al rol
    await this.roleRepository.addPermission(data.roleId, data.permissionId);
  }
}
