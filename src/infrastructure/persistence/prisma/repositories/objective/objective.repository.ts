import { Activity } from '@/domain/entities/activity.entity';
import { Objective } from '@/domain/entities/objective.entity';
import { Service } from '@/domain/entities/service.entity';
import { IObjectiveRepository } from '@/domain/repositories/objective.repository';
import { Injectable } from '@nestjs/common';
import { PrismaObjectiveMapper } from '../../mapper/prisma-objective.mapper';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class ObjectiveRepository implements IObjectiveRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Objective[]> {
    const objectives = await this.prisma.objective.findMany();
    return objectives.map((objective) => new Objective(objective));
  }

  async findById(id: string): Promise<Objective | null> {
    const objective = await this.prisma.objective.findUnique({
      where: { id },
    });
    return objective ? new Objective(objective) : null;
  }

  async create(objective: Objective): Promise<Objective> {
    const createData = PrismaObjectiveMapper.toCreateInput(objective);
    const createdObjective = await this.prisma.objective.create({
      data: createData,
    });
    return PrismaObjectiveMapper.toDomain(createdObjective);
  }

  async update(id: string, objective: Partial<Objective>): Promise<Objective> {
    const updateData = PrismaObjectiveMapper.toUpdateInput(objective);
    const updatedObjective = await this.prisma.objective.update({
      where: { id },
      data: updateData,
    });
    return PrismaObjectiveMapper.toDomain(updatedObjective);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.objective.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async findByServiceId(serviceId: string): Promise<Objective[]> {
    const objectives = await this.prisma.objective.findMany({
      where: { serviceId },
    });
    return objectives.map((objective) => new Objective(objective));
  }

  async addActivity(objectiveId: string, activityId: string): Promise<void> {
    await this.prisma.objective.update({
      where: { id: objectiveId },
      data: { activities: { connect: { id: activityId } } },
    });
  }

  async removeActivity(objectiveId: string, activityId: string): Promise<void> {
    await this.prisma.objective.update({
      where: { id: objectiveId },
      data: { activities: { disconnect: { id: activityId } } },
    });
  }

  async getActivities(objectiveId: string): Promise<Activity[]> {
    const activities = await this.prisma.activity.findMany({
      where: { objectiveId },
    });
    return activities.map((activity) => new Activity(activity));
  }

  async getService(objectiveId: string): Promise<Service | null> {
    const objective = await this.prisma.objective.findUnique({
      where: { id: objectiveId },
      include: { service: true },
    });
    return objective?.service ? new Service(objective.service) : null;
  }

  async getObjectivesByServiceId(serviceId: string): Promise<Objective[]> {
    const objectives = await this.prisma.objective.findMany({
      where: { serviceId },
      include: { activities: true },
    });
    return objectives.map(
      (objective) =>
        new Objective({
          id: objective.id,
          name: objective.name,
          description: objective.description,
          activities: objective.activities.map((activity) => activity.id),
        }),
    );
  }
}
