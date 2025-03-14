import { CreateServiceUseCase } from '@/application/use-cases/services/create-service.use-case';
import { GetServicesUseCase } from '@/application/use-cases/services/get-services.use-case';
import { Auth } from '@/gateway/decorators/auth.decorator';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateServiceDto } from './dtos/create-service.dto';
import { ServiceResponseDto } from './dtos/service-response.dto';
@Controller({
  path: 'services',
  version: '1',
})
@Auth()
export class ServicesController {
  constructor(
    private readonly createServiceUseCase: CreateServiceUseCase,
    private readonly getServicesUseCase: GetServicesUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo servicio' })
  @ApiResponse({
    status: 201,
    description: 'El servicio ha sido creado exitosamente',
    type: ServiceResponseDto,
  })
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

  @Get()
  @ApiOperation({ summary: 'Obtener todos los servicios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de servicios',
    type: [ServiceResponseDto],
  })
  async getServices(): Promise<ServiceResponseDto[]> {
    const services = await this.getServicesUseCase.execute();
    return services.map((service) => ({
      id: service.id,
      name: service.name,
      description: service.description || '',
      objectives: service.objectives || [],
      isActive: service.isActive,
    }));
  }
}
