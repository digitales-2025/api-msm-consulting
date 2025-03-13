import { Permission } from '@prisma/client';
import { IRole } from '../interfaces/role.interface';
import { Entity } from './entity';

export class Role extends Entity<IRole> {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: IRole) {
    super(props);
    this.id = props.id;
    this.name = props.name;
    this.description = props.description ?? undefined;
    this.isActive = props.isActive ?? true;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  getPermissions(): Permission[] {
    return this.permissions;
  }
}
