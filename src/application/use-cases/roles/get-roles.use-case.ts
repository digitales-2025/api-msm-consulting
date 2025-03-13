import { Role } from '@/domain/entities/role.entity';
import { ROLE_REPOSITORY } from '@/domain/repositories/repositories.providers';
import { IRoleRepository } from '@/domain/repositories/role.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetRolesUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private roleRepository: IRoleRepository,
  ) {}

  async execute(): Promise<Role[]> {
    const roles = await this.roleRepository.findAll();

    // Para cada rol, obtener sus permisos
    const rolesWithPermissions = await Promise.all(
      roles.map(async (role) => {
        const permissionIds = await this.roleRepository.getPermissions(role.id);

        // Creamos una copia del objeto role y añadimos la propiedad permissionIds
        const roleObject = role as unknown as Record<string, any>;
        roleObject.permissionIds = permissionIds;

        return roleObject as unknown as Role;
      }),
    );

    return rolesWithPermissions;
  }
}
