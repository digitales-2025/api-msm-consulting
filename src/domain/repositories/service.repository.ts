import { Objective } from '../entities/objective.entity';
import { Service } from '../entities/service.entity';

export interface IServiceRepository {
  findAll(): Promise<Service[]>;
  findById(id: string): Promise<Service | null>;
  create(service: Service): Promise<Service>;
  update(id: string, service: Partial<Service>): Promise<Service>;
  delete(id: string): Promise<void>;

  // Métodos para manejar asociaciones
  addObjective(serviceId: string, objectiveId: string): Promise<void>;
  removeObjective(serviceId: string, objectiveId: string): Promise<void>;
  getObjectives(serviceId: string): Promise<Objective[]>;
}
