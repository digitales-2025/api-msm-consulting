import { Activity } from '../entities/activity.entity';
import { Objective } from '../entities/objective.entity';
import { User } from '../entities/user.entity';

export interface IActivityRepository {
  findAll(): Promise<Activity[]>;
  findById(id: string): Promise<Activity | null>;
  findByObjectiveId(objectiveId: string): Promise<Activity[]>;
  findByResponsibleUserId(userId: string): Promise<Activity[]>;
  create(activity: Activity): Promise<Activity>;
  update(id: string, activity: Partial<Activity>): Promise<Activity>;
  delete(id: string): Promise<void>;

  // Métodos para manejar asociaciones
  getObjective(activityId: string): Promise<Objective | null>;
  getResponsibleUser(activityId: string): Promise<User | null>;
  getActivitiesByObjectiveId(objectiveId: string): Promise<Activity[]>;
  getActivitiesByResponsibleUserId(
    responsibleUserId: string,
  ): Promise<Activity[]>;
}
