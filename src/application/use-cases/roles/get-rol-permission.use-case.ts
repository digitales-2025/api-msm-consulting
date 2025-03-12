import { Permission } from '@/domain/entities/permission.entity';
import { ROLE_REPOSITORY } from '@/domain/repositories/repositories.providers';
import { IRoleRepository } from '@/domain/repositories/role.repository';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

interface GetRolPermissionDTO {
  roleId: string;
}

@Injectable()
export class GetRolePermissionsUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(data: GetRolPermissionDTO): Promise<Permission[]> {
    const role = await this.roleRepository.findById(data.roleId);
    if (!role) {
      throw new NotFoundException(`Rol con ID "${data.roleId}" no encontrado`);
    }

    const permissionsData = await this.roleRepository.getRolePermissions(
      data.roleId,
    );

    // Mapear los datos a entidades Permission
    const permissions = permissionsData.map(
      (perm) =>
        new Permission({
          id: perm.id,
          name: perm.name,
          description: perm.description,
          resource: perm.resource,
          action: perm.action,
          createdAt: perm.createdAt,
          updatedAt: perm.updatedAt,
        }),
    );

    return permissions;
  }
}
