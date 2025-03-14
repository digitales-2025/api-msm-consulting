import { Activity } from '@/domain/entities/activity.entity';
import { Frequency, Prisma, Activity as PrismaActivity } from '@prisma/client';

export class PrismaActivityMapper {
  static toDomain(entity: PrismaActivity): Activity {
    return new Activity({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      responsibleUserId: entity.responsibleUserId ?? '',
      frequency: entity.frequency ?? '',
      scheduleDate: entity.scheduleDate ?? '',
      executionDate: entity.executionDate ?? '',
      objectiveId: entity.objectiveId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toCreateInput(activity: Activity): Prisma.ActivityCreateInput {
    return {
      name: activity.name,
      description: activity.description,
      responsibleUser: {
        connect: {
          id: activity.responsibleUserId ?? '',
        },
      },
      frequency: activity.frequency as Frequency,
      scheduleDate: activity.scheduleDate,
      executionDate: activity.executionDate,
      objective: {
        connect: {
          id: activity.objectiveId,
        },
      },
    };
  }

  static toUpdateInput(
    activity: Partial<Activity>,
  ): Prisma.ActivityUpdateInput {
    const data: Prisma.ActivityUpdateInput = {};

    if (activity.name !== undefined) data.name = activity.name;
    if (activity.description !== undefined)
      data.description = activity.description;
    if (activity.responsibleUserId !== undefined)
      data.responsibleUser = {
        connect: { id: activity.responsibleUserId ?? '' },
      };
    if (activity.frequency !== undefined)
      data.frequency = activity.frequency as Frequency;
    if (activity.scheduleDate !== undefined)
      data.scheduleDate = activity.scheduleDate;
    if (activity.executionDate !== undefined)
      data.executionDate = activity.executionDate;
    if (activity.objectiveId !== undefined)
      data.objective = { connect: { id: activity.objectiveId } };

    return data;
  }
}
