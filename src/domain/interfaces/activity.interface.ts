import { IUser } from './user.interface';

export interface IActivity {
  id: string;
  name: string;
  description?: string | null;
  isActive?: boolean;
  isGlobal?: boolean;
  isEvidence?: boolean;
  fileUrl?: string | null;
  responsibleUserId: string;
  responsibleUser?: IUser;
  frequency: string;
  scheduleDate: Date;
  executionDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
  objectiveId: string;
  objective?: string;
}
