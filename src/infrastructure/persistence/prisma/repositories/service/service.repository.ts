import { Objective } from '@/domain/entities/objective.entity';
import { Service } from '@/domain/entities/service.entity';
import { IServiceRepository } from '@/domain/repositories/service.repository';
import { Injectable } from '@nestjs/common';
import { PrismaServiceMapper } from '../../mapper/prisma-service.mapper';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class ServiceRepository implements IServiceRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Service[]> {
    const services = await this.prisma.service.findMany({
      where: { isActive: true },
      include: {
        objectives: true,
      },
    });
    return services.map(
      (service) =>
        new Service({
          id: service.id,
          name: service.name,
          description: service.description,
          objectives: service.objectives.map((objective) => objective.id),
          isActive: service.isActive,
          isGlobal: service.isGlobal,
          createdAt: service.createdAt,
          updatedAt: service.updatedAt,
        }),
    );
  }

  async findById(id: string): Promise<Service | null> {
    const service = await this.prisma.service.findUnique({
      where: { id },
    });
    return service ? new Service(service) : null;
  }

  async create(service: Service): Promise<Service> {
    const prismaData = PrismaServiceMapper.toPrisma(service);

    const createdService = await this.prisma.service.create({
      data: prismaData,
    });
    return PrismaServiceMapper.toDomain(createdService);
  }

  async update(id: string, service: Partial<Service>): Promise<Service> {
    const prismaData = PrismaServiceMapper.toPrisma(service as Service);

    const updatedService = await this.prisma.service.update({
      where: { id },
      data: prismaData,
    });
    return PrismaServiceMapper.toDomain(updatedService);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.service.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async addObjective(serviceId: string, objectiveId: string): Promise<void> {
    await this.prisma.objective.update({
      where: {
        id: objectiveId,
      },
      data: {
        serviceId: serviceId,
      },
    });
  }

  async removeObjective(serviceId: string, objectiveId: string): Promise<void> {
    await this.prisma.objective.update({
      where: {
        id: objectiveId,
        serviceId: serviceId,
      },
      data: {
        isActive: false,
      },
    });
  }

  async getObjectives(serviceId: string): Promise<Objective[]> {
    const objectives = await this.prisma.objective.findMany({
      where: { serviceId },
      include: { activities: true },
    });

    return objectives.map((prismaObjective) => {
      // Extraer los IDs de actividades si existen
      const activityIds = prismaObjective.activities
        ? prismaObjective.activities.map((activity) => activity.id)
        : [];

      // Construir el objeto compatible con IObjective
      return new Objective({
        id: prismaObjective.id,
        name: prismaObjective.name,
        description: prismaObjective.description || '',
        isActive: prismaObjective.isActive,
        isGlobal: prismaObjective.isGlobal,
        createdAt: prismaObjective.createdAt,
        updatedAt: prismaObjective.updatedAt,
        serviceId: prismaObjective.serviceId,
        activities: activityIds,
      });
    });
  }
}
