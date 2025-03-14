import { CreateServiceUseCase } from '@/application/use-cases/services/create-service.use-case';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateServiceDto } from './dtos/create-service.dto';
import { ServiceResponseDto } from './dtos/service-response.dto';
@Controller('services')
export class ServicesController {
  constructor(private readonly createServiceUseCase: CreateServiceUseCase) {}

  @Post()
  async create(
    @Body() createServiceDto: CreateServiceDto,
  ): Promise<ServiceResponseDto> {
    const service = await this.createServiceUseCase.execute(createServiceDto);
    return {
      id: service.id,
      name: service.name,
      description: service.description || '',
      objectives: service.objectives || [],
      isActive: service.isActive,
    };
  }
}
