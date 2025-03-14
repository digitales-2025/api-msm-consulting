import { ServicesUserCasesModule } from '@/application/use-cases/services/services-user-cases.module';
import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';

@Module({
  imports: [ServicesUserCasesModule],
  controllers: [ServicesController],
})
export class ServicesModule {}
