import { IObjective } from '../interfaces/objective.interface';
import { Entity } from './entity';

export class Objective extends Entity<IObjective> {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  isGlobal: boolean;
  createdAt: Date;
  updatedAt: Date;
  serviceId: string;
  activities: string[];

  constructor(props: IObjective) {
    super(props);
    this.id = props.id;
    this.name = props.name;
    this.description = props.description ?? '';
    this.isActive = props.isActive ?? true;
    this.isGlobal = props.isGlobal ?? true;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
    this.serviceId = props.serviceId;
    this.activities = props.activities ?? [];
  }
}
