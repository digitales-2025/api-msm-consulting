import { SERVICE_REPOSITORY } from '@/domain/repositories/repositories.providers';
import { IServiceRepository } from '@/domain/repositories/service.repository';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class DeleteServiceUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepository: IServiceRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const service = await this.serviceRepository.findById(id);
    if (!service) {
      throw new NotFoundException('Servicio no encontrado');
    }
    await this.serviceRepository.delete(id);
  }
}
