import { CreateServiceUseCase } from '@/application/use-cases/services/create-service.use-case';
import { DeleteServiceUseCase } from '@/application/use-cases/services/delete-service.use-case';
import { GetServicesUseCase } from '@/application/use-cases/services/get-services.use-case';
import { UpdateServiceUseCase } from '@/application/use-cases/services/update-service.use-case';
import { Auth } from '@/gateway/decorators/auth.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateServiceDto } from './dtos/create-service.dto';
import { ServiceResponseDto } from './dtos/service-response.dto';
import { UpdateServiceDto } from './dtos/update-service.dto';
@Controller({
  path: 'services',
  version: '1',
})
@Auth()
export class ServicesController {
  constructor(
    private readonly createServiceUseCase: CreateServiceUseCase,
    private readonly getServicesUseCase: GetServicesUseCase,
    private readonly updateServiceUseCase: UpdateServiceUseCase,
    private readonly deleteServiceUseCase: DeleteServiceUseCase,
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

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un servicio existente' })
  @ApiResponse({
    status: 200,
    description: 'El servicio ha sido actualizado exitosamente',
    type: ServiceResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ): Promise<ServiceResponseDto> {
    const service = await this.updateServiceUseCase.execute({
      id,
      ...updateServiceDto,
    });
    return {
      id: service.id,
      name: service.name,
      description: service.description || '',
      objectives: service.objectives || [],
      isActive: service.isActive,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un servicio existente' })
  @ApiResponse({
    status: 200,
    description: 'El servicio ha sido eliminado exitosamente',
  })
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.deleteServiceUseCase.execute(id);
    return { message: 'Servicio eliminado exitosamente' };
  }
}
