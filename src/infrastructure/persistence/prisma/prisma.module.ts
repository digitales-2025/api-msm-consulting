import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { REPOSITORIES_PROVIDERS } from './repositories/repositories.providers';

@Module({
  providers: [PrismaService, ...REPOSITORIES_PROVIDERS],
  exports: [PrismaService, ...REPOSITORIES_PROVIDERS],
})
export class PrismaModule {}
