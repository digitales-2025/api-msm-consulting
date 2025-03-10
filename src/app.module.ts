import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UseCasesModule } from './application/use-cases/use-cases.module';
import { ControllersModule } from './gateway/controllers/controllers.module';
import { AuthModule } from './infrastructure/auth/auth.module';
import { PersistenceModule } from './infrastructure/persistence/persistence.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    AuthModule,
    PersistenceModule,
    ControllersModule,
    UseCasesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
