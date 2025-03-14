import { Activity } from '@/domain/entities/activity.entity';
import { Objective } from '@/domain/entities/objective.entity';
import { User } from '@/domain/entities/user.entity';
import { IActivityRepository } from '@/domain/repositories/activity.repository';
import { Injectable } from '@nestjs/common';
import { PrismaActivityMapper } from '../../mapper/prisma-activity.mapper';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class ActivityRepository implements IActivityRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Activity[]> {
    const activities = await this.prisma.activity.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return activities.map((activity) => new Activity(activity));
  }

  async findById(id: string): Promise<Activity | null> {
    const activity = await this.prisma.activity.findUnique({
      where: { id },
    });
    return activity ? PrismaActivityMapper.toDomain(activity) : null;
  }

  async findByObjectiveId(objectiveId: string): Promise<Activity[]> {
    const activities = await this.prisma.activity.findMany({
      where: { objectiveId },
    });
    return activities.map((activity) => new Activity(activity));
  }

  async findByResponsibleUserId(userId: string): Promise<Activity[]> {
    const activities = await this.prisma.activity.findMany({
      where: { responsibleUserId: userId },
    });
    return activities.map((activity) => new Activity(activity));
  }

  async create(activity: Activity): Promise<Activity> {
    const prismaActivity = PrismaActivityMapper.toCreateInput(activity);
    const createdActivity = await this.prisma.activity.create({
      data: prismaActivity,
    });
    return PrismaActivityMapper.toDomain(createdActivity);
  }

  async update(id: string, activity: Partial<Activity>): Promise<Activity> {
    const prismaActivity = PrismaActivityMapper.toUpdateInput(activity);
    const updatedActivity = await this.prisma.activity.update({
      where: { id },
      data: prismaActivity,
    });
    return PrismaActivityMapper.toDomain(updatedActivity);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.activity.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getObjective(activityId: string): Promise<Objective | null> {
    const activity = await this.prisma.activity.findUnique({
      where: { id: activityId },
      include: { objective: true },
    });
    return activity?.objective ? new Objective(activity.objective) : null;
  }

  async getResponsibleUser(activityId: string): Promise<User | null> {
    const activity = await this.prisma.activity.findUnique({
      where: { id: activityId },
      include: { responsibleUser: true },
    });
    return activity?.responsibleUser
      ? new User(activity.responsibleUser)
      : null;
  }

  async getActivitiesByObjectiveId(objectiveId: string): Promise<Activity[]> {
    const activities = await this.prisma.activity.findMany({
      where: { objectiveId },
    });
    return activities.map((activity) => new Activity(activity));
  }

  async getActivitiesByResponsibleUserId(
    responsibleUserId: string,
  ): Promise<Activity[]> {
    const activities = await this.prisma.activity.findMany({
      where: { responsibleUserId },
    });
    return activities.map((activity) => new Activity(activity));
  }
}
