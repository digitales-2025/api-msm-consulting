import { Service } from '@/domain/entities/service.entity';
import { SERVICE_REPOSITORY } from '@/domain/repositories/repositories.providers';
import { IServiceRepository } from '@/domain/repositories/service.repository';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

interface UpdateServiceDTO {
  id: string;
  name?: string;
  description?: string;
  objectives?: string[];
}

@Injectable()
export class UpdateServiceUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private serviceRepository: IServiceRepository,
  ) {}

  async execute(data: UpdateServiceDTO): Promise<Service> {
    const service = await this.serviceRepository.findById(data.id);
    if (!service) {
      throw new NotFoundException('Servicio no encontrado');
    }

    const serviceToUpdate: Partial<Service> = {};

    if (data.name) {
      serviceToUpdate.name = data.name;
    }

    if (data.description !== undefined) {
      serviceToUpdate.description = data.description;
    }

    return this.serviceRepository.update(data.id, serviceToUpdate);
  }
}
