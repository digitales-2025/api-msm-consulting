import { Role } from '../entities/role.entity';

export interface IRoleRepository {
  findAll(): Promise<Role[]>;
  findById(id: string): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  create(role: Role): Promise<Role>;
  update(id: string, role: Partial<Role>): Promise<Role>;
  delete(id: string): Promise<void>;

  // Métodos para manejar asociaciones
  addPermission(roleId: string, permissionId: string): Promise<void>;
  removePermission(roleId: string, permissionId: string): Promise<void>;
  getPermissions(roleId: string): Promise<string[]>; // Devuelve IDs de permisos
  getUserRoles(userId: string): Promise<Role[]>;
}
