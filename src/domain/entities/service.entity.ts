import { IService } from '../interfaces/service.interface';
import { Entity } from './entity';

export class Service extends Entity<IService> {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  isGlobal: boolean;
  createdAt: Date;
  updatedAt: Date;
  objectives: string[];

  constructor(props: IService) {
    super(props);
    this.id = props.id;
    this.name = props.name;
    this.description = props.description ?? '';
    this.isActive = props.isActive ?? true;
    this.isGlobal = props.isGlobal ?? true;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
    this.objectives = props.objectives ?? [];
  }
}
