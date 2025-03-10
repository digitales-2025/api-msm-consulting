import { PersistenceModule } from '@/infrastructure/persistence/persistence.module';
import { Module } from '@nestjs/common';
import { REPOSITORIES_PROVIDERS } from './repositories.providers';

@Module({
  imports: [PersistenceModule],
  providers: [...REPOSITORIES_PROVIDERS],
  exports: [...REPOSITORIES_PROVIDERS],
})
export class RepositoriesModule {}
