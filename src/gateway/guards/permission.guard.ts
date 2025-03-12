import { IPermissionRepository } from '@/domain/repositories/permission.repository';
import { PERMISSION_REPOSITORY } from '@/domain/repositories/repositories.providers';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  PERMISSIONS_KEY,
  RequiredPermission,
} from '../decorators/require-permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(PERMISSION_REPOSITORY)
    private permissionRepository: IPermissionRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<
      RequiredPermission[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    // Si no se requieren permisos, permitir el acceso
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    // Verificar si el usuario está autenticado
    if (!user || !user.id) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    // Obtener los permisos del usuario
    const userPermissions = await this.permissionRepository.getUserPermissions(
      user.id,
    );

    // Verificar si el usuario tiene los permisos requeridos
    const hasAllPermissions = requiredPermissions.every((required) => {
      return userPermissions.some(
        (permission) =>
          permission.resource === required.resource &&
          permission.action === required.action,
      );
    });

    if (!hasAllPermissions) {
      throw new ForbiddenException(
        'No tienes permiso para realizar esta acción',
      );
    }

    return true;
  }
}
