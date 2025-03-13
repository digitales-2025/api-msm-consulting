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

interface DeleteRoleDTO {
  roleId: string;
}

@Injectable()
export class DeleteRoleUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(data: DeleteRoleDTO): Promise<void> {
    // Verificar si el rol existe
    const role = await this.roleRepository.findById(data.roleId);
    if (!role) {
      throw new NotFoundException(`Rol con ID "${data.roleId}" no encontrado`);
    }

    // Verificar si el rol ya está inactivo
    if (!role.isActive) {
      throw new BadRequestException(
        `El rol con ID "${data.roleId}" ya está inactivo`,
      );
    }

    // Verificar si el rol está asignado a algún usuario
    const usersWithRole = await this.userRepository.findByRoleId(data.roleId);
    if (usersWithRole && usersWithRole.length > 0) {
      throw new BadRequestException(
        `No se puede eliminar el rol porque está asignado a ${usersWithRole.length} usuario(s)`,
      );
    }

    // Desactivar el rol (eliminación lógica)
    await this.roleRepository.update(data.roleId, {
      isActive: false,
      updatedAt: new Date(),
    });
  }
}
