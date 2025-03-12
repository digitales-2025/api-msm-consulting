import { IRole } from '../interfaces/role.interface';
import { Entity } from './entity';

export class Role extends Entity<IRole> {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: IRole) {
    super(props);
    this.id = props.id;
    this.name = props.name;
    this.description = props.description ?? undefined;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
