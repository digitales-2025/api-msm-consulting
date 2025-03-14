import { ROLE_REPOSITORY } from '@/domain/repositories/repositories.providers';
import { IServiceRepository } from '@/domain/repositories/service.repository';
import { ServiceResponseDto } from '@/gateway/controllers/services/dtos/service-response.dto';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetServicesUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly serviceRepository: IServiceRepository,
  ) {}

  async execute(): Promise<ServiceResponseDto[]> {
    return this.serviceRepository.findAll();
  }
}
