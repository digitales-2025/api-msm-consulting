import { Objective } from '@/domain/entities/objective.entity';
import { Prisma, Objective as PrismaObjective } from '@prisma/client';

export class PrismaObjectiveMapper {
  static toDomain(entity: PrismaObjective): Objective {
    return new Objective({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      isActive: entity.isActive,
      isGlobal: entity.isGlobal,
      serviceId: entity.serviceId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toCreateInput(objective: Objective): Prisma.ObjectiveCreateInput {
    return {
      name: objective.name,
      description: objective.description,
      isActive: objective.isActive,
      isGlobal: objective.isGlobal,
      service: {
        connect: { id: objective.serviceId },
      },
    };
  }

  static toUpdateInput(
    objective: Partial<Objective>,
  ): Prisma.ObjectiveUpdateInput {
    const data: Prisma.ObjectiveUpdateInput = {};

    if (objective.name !== undefined) data.name = objective.name;
    if (objective.description !== undefined)
      data.description = objective.description;
    if (objective.isActive !== undefined) data.isActive = objective.isActive;
    if (objective.isGlobal !== undefined) data.isGlobal = objective.isGlobal;
    if (objective.serviceId !== undefined) {
      data.service = { connect: { id: objective.serviceId } };
    }

    return data;
  }
}
