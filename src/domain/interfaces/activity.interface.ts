import { IUser } from './user.interface';

export interface IActivity {
  id: string;
  name: string;
  description?: string | null;
  isActive?: boolean;
  isGlobal?: boolean;
  isEvidence?: boolean;
  fileUrl?: string | null;
  responsibleUserId?: string | null;
  responsibleUser?: IUser | null;
  frequency?: string | null;
  scheduleDate?: string | null;
  executionDate?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  objectiveId: string;
  objective?: string;
}
