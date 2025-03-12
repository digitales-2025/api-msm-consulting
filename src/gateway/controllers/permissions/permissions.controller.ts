import { CreatePermissionUseCase } from '@/application/use-cases/permissions/create-permission.use-case';
import { IPermissionRepository } from '@/domain/repositories/permission.repository';
import { PERMISSION_REPOSITORY } from '@/domain/repositories/repositories.providers';
import { Auth } from '@/gateway/decorators/auth.decorator';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

// DTOs
class CreatePermissionDto {
  name: string;
  description?: string;
  resource: string;
  action: string;
}

@ApiTags('Permissions')
@Controller({
  path: 'permissions',
  version: '1',
})
export class PermissionsController {
  constructor(
    private readonly createPermissionUseCase: CreatePermissionUseCase,
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  @Post()
  @Auth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo permiso' })
  @ApiResponse({
    status: 201,
    description: 'Permiso creado exitosamente',
  })
  async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    const permission =
      await this.createPermissionUseCase.execute(createPermissionDto);
    return {
      id: permission.id,
      name: permission.name,
      description: permission.description,
      resource: permission.resource,
      action: permission.action,
    };
  }

  @Get()
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener todos los permisos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de permisos',
  })
  async getPermissions() {
    const permissions = await this.permissionRepository.findAll();
    return permissions.map((permission) => ({
      id: permission.id,
      name: permission.name,
      description: permission.description,
      resource: permission.resource,
      action: permission.action,
    }));
  }
}
