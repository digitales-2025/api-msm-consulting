import { Service } from '@/domain/entities/service.entity';
import { Prisma, Service as PrismaService } from '@prisma/client';

export class PrismaServiceMapper {
  static toDomain(entity: PrismaService): Service {
    return new Service({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toPrisma(service: Service): Prisma.ServiceUncheckedCreateInput {
    return {
      name: service.name,
      description: service.description,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    };
  }
}
