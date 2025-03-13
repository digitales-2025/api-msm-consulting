import { PersistenceModule } from '@/infrastructure/persistence/persistence.module';
import { Module } from '@nestjs/common';
import { AssignPermissionToRoleUseCase } from './assign-permission-to-role.use-case';
import { AssignRoleToUserUseCase } from './assign-role-to-user.use-case';
import { CreateRoleUseCase } from './create-role.use-case';
import { DeleteRoleUseCase } from './delete-rol.use-case';
import { GetRolePermissionsUseCase } from './get-rol-permission.use-case';
import { GetRolesUseCase } from './get-roles.use-case';
import { UpdateRoleUseCase } from './update-role.use-case';

@Module({
  imports: [PersistenceModule],
  providers: [
    CreateRoleUseCase,
    GetRolesUseCase,
    AssignPermissionToRoleUseCase,
    AssignRoleToUserUseCase,
    GetRolePermissionsUseCase,
    UpdateRoleUseCase,
    DeleteRoleUseCase,
  ],
  exports: [
    CreateRoleUseCase,
    GetRolesUseCase,
    AssignPermissionToRoleUseCase,
    AssignRoleToUserUseCase,
    GetRolePermissionsUseCase,
    UpdateRoleUseCase,
    DeleteRoleUseCase,
  ],
})
export class RolesUseCasesModule {}
