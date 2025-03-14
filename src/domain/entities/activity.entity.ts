import { IActivity } from '../interfaces/activity.interface';
import { Entity } from './entity';

export class Activity extends Entity<IActivity> {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  isGlobal: boolean;
  isEvidence: boolean;
  fileUrl: string | null;
  responsibleUserId?: string | null;
  frequency?: string | null;
  scheduleDate?: string | null;
  executionDate?: string | null;
  createdAt: Date;
  updatedAt: Date;
  objectiveId: string;
  objective: string;

  constructor(props: IActivity) {
    super(props);
    this.id = props.id;
    this.name = props.name;
    this.description = props.description ?? '';
    this.isActive = props.isActive ?? true;
    this.isGlobal = props.isGlobal ?? true;
    this.isEvidence = props.isEvidence ?? false;
    this.fileUrl = props.fileUrl ?? '';
    this.responsibleUserId = props.responsibleUserId ?? '';
    this.frequency = props.frequency ?? '';
    this.scheduleDate = props.scheduleDate ?? '';
    this.executionDate = props.executionDate ?? '';
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
    this.objectiveId = props.objectiveId;
    this.objective = props.objective ?? '';
  }
}
