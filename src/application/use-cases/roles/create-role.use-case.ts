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

interface CreateRoleDTO {
  name: string;
  description?: string;
  permissionIds?: string[];
}

@Injectable()
export class CreateRoleUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private roleRepository: IRoleRepository,
    @Inject(PERMISSION_REPOSITORY)
    private permissionRepository: IPermissionRepository,
  ) {}

  async execute(data: CreateRoleDTO): Promise<Role> {
    // Verificar si ya existe un rol con el mismo nombre
    const existingRole = await this.roleRepository.findByName(data.name);
    if (existingRole) {
      throw new BadRequestException(
        `El rol con nombre "${data.name}" ya existe`,
      );
    }

    // Crear un nuevo rol
    const role = new Role({
      id: '', // Será generado por la base de datos
      name: data.name,
      description: data.description,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Guardar el rol en la base de datos
    const createdRole = await this.roleRepository.create(role);

    // Asignar permisos si se proporcionaron
    if (data.permissionIds && data.permissionIds.length > 0) {
      for (const permissionId of data.permissionIds) {
        // Verificar si el permiso existe
        const permission =
          await this.permissionRepository.findById(permissionId);
        if (!permission) {
          throw new NotFoundException(
            `Permiso con ID ${permissionId} no encontrado`,
          );
        }

        // Asignar el permiso al rol
        await this.roleRepository.addPermission(createdRole.id, permissionId);
      }

      // Recargar el rol con sus permisos
      const updatedRole = await this.roleRepository.findById(createdRole.id);
      if (!updatedRole) {
        throw new Error(
          `No se pudo cargar el rol creado con ID ${createdRole.id}`,
        );
      }
      return updatedRole;
    }

    return createdRole;
  }
}
