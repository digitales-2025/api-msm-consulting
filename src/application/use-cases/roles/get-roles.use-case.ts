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
    return this.roleRepository.findAll();
  }
}
