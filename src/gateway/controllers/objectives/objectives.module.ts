import { ObjectivesUseCasesModule } from '@/application/use-cases/objectives/objectives-use-cases.module';
import { Module } from '@nestjs/common';
import { ObjectivesController } from './objectives.controller';

@Module({
  imports: [ObjectivesUseCasesModule],
  controllers: [ObjectivesController],
})
export class ObjectivesModule {}
