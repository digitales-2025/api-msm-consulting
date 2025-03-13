import { Permission } from '@/domain/entities/permission.entity';
import { IPermissionRepository } from '@/domain/repositories/permission.repository';
import { PERMISSION_REPOSITORY } from '@/domain/repositories/repositories.providers';
import { Inject, Injectable } from '@nestjs/common';

interface CreatePermissionDTO {
  name: string;
  description?: string;
  resource: string;
  action: string;
}

@Injectable()
export class CreatePermissionUseCase {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private permissionRepository: IPermissionRepository,
  ) {}

  async execute(data: CreatePermissionDTO): Promise<Permission> {
    // Verificar si ya existe un permiso con el mismo nombre
    const existingPermission = await this.permissionRepository.findByName(
      data.name,
    );
    if (existingPermission) {
      throw new Error(`El permiso con nombre "${data.name}" ya existe`);
    }

    // Verificar si ya existe un permiso para el mismo recurso y acción
    const existingResourceAction =
      await this.permissionRepository.findByResourceAndAction(
        data.resource,
        data.action,
      );
    if (existingResourceAction) {
      throw new Error(
        `Ya existe un permiso para el recurso "${data.resource}" y la acción "${data.action}"`,
      );
    }

    // Crear un nuevo permiso
    const permission = new Permission({
      id: '', // Será generado por la base de datos
      name: data.name,
      description: data.description,
      resource: data.resource,
      action: data.action,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.permissionRepository.create(permission);
  }
}
