import { Permission } from '../entities/permission.entity';

export interface IPermissionRepository {
  findAll(): Promise<Permission[]>;
  findById(id: string): Promise<Permission | null>;
  findByName(name: string): Promise<Permission | null>;
  findByResourceAndAction(
    resource: string,
    action: string,
  ): Promise<Permission | null>;
  create(permission: Permission): Promise<Permission>;
  update(id: string, permission: Partial<Permission>): Promise<Permission>;
  delete(id: string): Promise<void>;

  // Métodos para manejar asociaciones
  getRolePermissions(roleId: string): Promise<Permission[]>;
  getUserPermissions(userId: string): Promise<Permission[]>;
}
