export interface IService {
  id: string;
  name: string;
  description?: string | null;
  isActive?: boolean;
  isGlobal?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  objectives?: string[];
}
