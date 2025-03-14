import { ActivitiesUseCasesModule } from '@/application/use-cases/activities/activities-use-cases.module';
import { Module } from '@nestjs/common';
import { ActivitiesController } from './activities.controller';

@Module({
  imports: [ActivitiesUseCasesModule],
  controllers: [ActivitiesController],
})
export class ActivitiesModule {}
