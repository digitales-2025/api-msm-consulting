import { Role } from '@/domain/entities/role.entity';
import { IPermissionRepository } from '@/domain/repositories/permission.repository';
import {
  PERMISSION_REPOSITORY,
  ROLE_REPOSITORY,
} from '@/domain/repositories/repositories.providers';
import { IRoleRepository } from '@/domain/repositories/role.repository';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

interface UpdateRoleDTO {
  id: string;
  name?: string;
  description?: string;
  permissionIds?: string[];
}

@Injectable()
export class UpdateRoleUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private roleRepository: IRoleRepository,
    @Inject(PERMISSION_REPOSITORY)
    private permissionRepository: IPermissionRepository,
  ) {}

  async execute(data: UpdateRoleDTO): Promise<Role> {
    // Verificar si el rol existe
    const existingRole = await this.roleRepository.findById(data.id);
    if (!existingRole) {
      throw new NotFoundException(`Rol con ID "${data.id}" no encontrado`);
    }

    // Si se actualiza el nombre, verificar que no exista otro rol con ese nombre
    if (data.name && data.name !== existingRole.name) {
      const roleWithSameName = await this.roleRepository.findByName(data.name);
      if (roleWithSameName && roleWithSameName.id !== data.id) {
        throw new BadRequestException(
          `Ya existe un rol con el nombre "${data.name}"`,
        );
      }
    }

    // Actualizar propiedades básicas del rol
    const roleToUpdate: Partial<Role> = {};

    if (data.name) {
      roleToUpdate.name = data.name;
    }

    if (data.description !== undefined) {
      roleToUpdate.description = data.description;
    }

    roleToUpdate.updatedAt = new Date();

    // Actualizar el rol en la base de datos
    const updatedRole = await this.roleRepository.update(data.id, roleToUpdate);

    // Si se proporcionaron IDs de permisos, actualizar los permisos
    if (data.permissionIds !== undefined) {
      // Obtener permisos actuales
      const currentPermissions = await this.roleRepository.getRolePermissions(
        data.id,
      );
      const currentPermissionIds = currentPermissions.map((p) => p.id);

      // Asegurarnos de que permissionIds sea un array no nulo
      const newPermissionIds = data.permissionIds || [];

      // Determinar permisos a agregar y quitar
      const permissionsToAdd = newPermissionIds.filter(
        (id) => !currentPermissionIds.includes(id),
      );
      const permissionsToRemove = currentPermissionIds.filter(
        (id) => !newPermissionIds.includes(id),
      );

      // Verificar existencia de nuevos permisos
      for (const permissionId of permissionsToAdd) {
        const permission =
          await this.permissionRepository.findById(permissionId);
        if (!permission) {
          throw new NotFoundException(
            `Permiso con ID ${permissionId} no encontrado`,
          );
        }
      }

      // Eliminar permisos que ya no están en la lista
      for (const permissionId of permissionsToRemove) {
        await this.roleRepository.removePermission(data.id, permissionId);
      }

      // Agregar nuevos permisos
      for (const permissionId of permissionsToAdd) {
        await this.roleRepository.addPermission(data.id, permissionId);
      }

      // Recargar el rol con sus permisos actualizados
      const refreshedRole = await this.roleRepository.findById(data.id);
      if (!refreshedRole) {
        throw new Error(
          `No se pudo cargar el rol actualizado con ID ${data.id}`,
        );
      }
      return refreshedRole;
    }

    return updatedRole;
  }
}
