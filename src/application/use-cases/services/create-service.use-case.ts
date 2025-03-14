import { Service } from '@/domain/entities/service.entity';
import { SERVICE_REPOSITORY } from '@/domain/repositories/repositories.providers';
import { IServiceRepository } from '@/domain/repositories/service.repository';
import { Inject, Injectable } from '@nestjs/common';

interface CreateServiceDTO {
  name: string;
  description?: string;
  objectives?: string[];
}

@Injectable()
export class CreateServiceUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private serviceRepository: IServiceRepository,
  ) {}

  async execute(data: CreateServiceDTO): Promise<Service> {
    const service = new Service({
      id: '',
      name: data.name,
      description: data.description,
      objectives: data.objectives || [],
    });
    return this.serviceRepository.create(service);
  }
}
