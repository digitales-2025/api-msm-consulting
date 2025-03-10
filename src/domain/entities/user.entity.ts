import { IUser } from '../interfaces/user.interface';
import { Entity } from './entity';

export class User extends Entity<IUser> {
  id: string;
  email: string;
  password: string;
  fullName: string;
  roles: string[];
  refreshToken: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: IUser) {
    super(props);
    this.id = props.id;
    this.email = props.email;
    this.password = props.password;
    this.fullName = props.fullName;
    this.roles = props.roles;
    this.refreshToken = props.refreshToken;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
