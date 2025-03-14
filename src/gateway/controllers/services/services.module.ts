import { ServicesUseCasesModule } from '@/application/use-cases/services/services-use-cases.module';
import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';

@Module({
  imports: [ServicesUseCasesModule],
  controllers: [ServicesController],
})
export class ServicesModule {}
