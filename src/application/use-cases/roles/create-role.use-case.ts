import { Role } from '@/domain/entities/role.entity';
import { ROLE_REPOSITORY } from '@/domain/repositories/repositories.providers';
import { IRoleRepository } from '@/domain/repositories/role.repository';
import { Inject, Injectable } from '@nestjs/common';

interface CreateRoleDTO {
  name: string;
  description?: string;
}

@Injectable()
export class CreateRoleUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private roleRepository: IRoleRepository,
  ) {}

  async execute(data: CreateRoleDTO): Promise<Role> {
    // Verificar si ya existe un rol con el mismo nombre
    const existingRole = await this.roleRepository.findByName(data.name);
    if (existingRole) {
      throw new Error(`El rol con nombre "${data.name}" ya existe`);
    }

    // Crear un nuevo rol
    const role = new Role({
      id: '', // Será generado por la base de datos
      name: data.name,
      description: data.description,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.roleRepository.create(role);
  }
}
