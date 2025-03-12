import { IPermission } from '../interfaces/permission.interface';
import { Entity } from './entity';

export class Permission extends Entity<IPermission> {
  id: string;
  name: string;
  description?: string;
  resource: string;
  action: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: IPermission) {
    super(props);
    this.id = props.id;
    this.name = props.name;
    this.description = props.description ?? undefined;
    this.resource = props.resource;
    this.action = props.action;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
