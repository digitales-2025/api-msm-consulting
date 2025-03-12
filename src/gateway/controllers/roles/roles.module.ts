import { RolesUseCasesModule } from '@/application/use-cases/roles/roles-use-cases.module';
import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';

@Module({
  imports: [RolesUseCasesModule],
  controllers: [RolesController],
})
export class RolesModule {}
