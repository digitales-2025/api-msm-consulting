import { CreateUserUseCase } from '@/application/use-cases/users/create-user.use-case';
import { FindAllUsersUseCase } from '@/application/use-cases/users/find-all-users.use-case';
import { FindUserByIdUseCase } from '@/application/use-cases/users/find-user-by-id.use-case';
import { UpdateUserUseCase } from '@/application/use-cases/users/update-user.use-case';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUserPermissionsUseCase } from 'src/application/use-cases/users/get-user-permissions.use-case';
import { Permission } from 'src/domain/entities/permission.entity';
import { PermissionResponseDto } from '../permissions/dtos/permission-response.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { UserResponseMapper } from './mappers/user-response.mapper';

@ApiTags('Usuarios')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly getUserPermissionsUseCase: GetUserPermissionsUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios',
    type: [UserResponseDto],
  })
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.findAllUsersUseCase.execute();
    return UserResponseMapper.toDTOList(users);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async findById(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.findUserByIdUseCase.execute(id);
    return UserResponseMapper.toDTO(user);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado con éxito',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o usuario ya existe',
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.createUserUseCase.execute(createUserDto);
    return UserResponseMapper.toDTO(user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un usuario existente' })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado con éxito',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.updateUserUseCase.execute(id, updateUserDto);
    return UserResponseMapper.toDTO(user);
  }

  @Get(':id/permissions')
  @ApiOperation({
    summary: 'Obtener permisos de un usuario',
    description:
      'Obtiene todos los permisos asignados a un usuario a través de sus roles',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Permisos obtenidos exitosamente',
    type: [PermissionResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuario no encontrado',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error interno del servidor',
  })
  async getUserPermissions(
    @Param('id') id: string,
  ): Promise<PermissionResponseDto[]> {
    const permissions: Permission[] =
      await this.getUserPermissionsUseCase.execute(id);

    return permissions.map((permission) => ({
      id: permission.id,
      name: permission.name,
      description: permission.description,
      resource: permission.resource,
      action: permission.action,
      createdAt: permission.createdAt,
      updatedAt: permission.updatedAt,
    }));
  }
}
