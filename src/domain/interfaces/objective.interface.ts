export interface IObjective {
  id: string;
  name: string;
  description?: string | null;
  isActive?: boolean;
  isGlobal?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  serviceId: string;
  service?: string;
  activities: string[];
}
