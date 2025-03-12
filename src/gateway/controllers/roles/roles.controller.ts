import { AssignPermissionToRoleUseCase } from '@/application/use-cases/roles/assign-permission-to-role.use-case';
import { AssignRoleToUserUseCase } from '@/application/use-cases/roles/assign-role-to-user.use-case';
import { CreateRoleUseCase } from '@/application/use-cases/roles/create-role.use-case';
import { GetRolesUseCase } from '@/application/use-cases/roles/get-roles.use-case';
import { Auth } from '@/gateway/decorators/auth.decorator';
import { RequirePermission } from '@/gateway/decorators/require-permission.decorator';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AssignPermissionDto } from './dtos/assign-permission.dto';
import { AssignRoleToUserDto } from './dtos/assign-role-to-user.dto';
import { CreateRoleDto } from './dtos/create-role.dto';
import { RoleResponseDto } from './dtos/role-response.dto';

@ApiTags('Roles')
@Controller({
  path: 'roles',
  version: '1',
})
@Auth()
export class RolesController {
  constructor(
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly getRolesUseCase: GetRolesUseCase,
    private readonly assignPermissionToRoleUseCase: AssignPermissionToRoleUseCase,
    private readonly assignRoleToUserUseCase: AssignRoleToUserUseCase,
  ) {}

  @Post()
  @Auth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo rol' })
  @ApiResponse({
    status: 201,
    description: 'Rol creado exitosamente',
    type: RoleResponseDto,
  })
  async createRole(
    @Body() createRoleDto: CreateRoleDto,
  ): Promise<RoleResponseDto> {
    const role = await this.createRoleUseCase.execute(createRoleDto);
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }

  @Get()
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener todos los roles' })
  @ApiResponse({
    status: 200,
    description: 'Lista de roles',
    type: [RoleResponseDto],
  })
  async getRoles(): Promise<RoleResponseDto[]> {
    const roles = await this.getRolesUseCase.execute();
    return roles.map((role) => ({
      id: role.id,
      name: role.name,
      description: role.description,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    }));
  }

  @Post(':roleId/permissions')
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Asignar un permiso a un rol' })
  @ApiResponse({
    status: 200,
    description: 'Permiso asignado exitosamente',
  })
  async assignPermission(
    @Param('roleId') roleId: string,
    @Body() assignPermissionDto: AssignPermissionDto,
  ) {
    await this.assignPermissionToRoleUseCase.execute({
      roleId,
      permissionId: assignPermissionDto.permissionId,
    });
    return {
      message: 'Permiso asignado exitosamente',
    };
  }

  @Post(':roleId/users')
  @RequirePermission('roles', 'assign')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Asignar un rol a un usuario' })
  @ApiResponse({
    status: 200,
    description: 'Rol asignado exitosamente al usuario',
  })
  async assignRoleToUser(
    @Param('roleId') roleId: string,
    @Body() assignRoleToUserDto: AssignRoleToUserDto,
  ) {
    await this.assignRoleToUserUseCase.execute({
      roleId,
      userId: assignRoleToUserDto.userId,
    });
    return {
      message: 'Rol asignado exitosamente al usuario',
    };
  }
}
