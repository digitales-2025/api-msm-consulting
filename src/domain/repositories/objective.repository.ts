import { Activity } from '../entities/activity.entity';
import { Objective } from '../entities/objective.entity';
import { Service } from '../entities/service.entity';

export interface IObjectiveRepository {
  findAll(): Promise<Objective[]>;
  findById(id: string): Promise<Objective | null>;
  findByServiceId(serviceId: string): Promise<Objective[]>;
  create(objective: Objective): Promise<Objective>;
  update(id: string, objective: Partial<Objective>): Promise<Objective>;
  delete(id: string): Promise<void>;

  // Métodos para manejar asociaciones
  addActivity(objectiveId: string, activityId: string): Promise<void>;
  removeActivity(objectiveId: string, activityId: string): Promise<void>;
  getActivities(objectiveId: string): Promise<Activity[]>;
  getService(objectiveId: string): Promise<Service | null>;
}
