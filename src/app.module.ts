import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UseCasesModule } from './application/use-cases/use-cases.module';
import { AuthModule as GatewayAuthModule } from './gateway/controllers/auth/auth.module';
import { ControllersModule } from './gateway/controllers/controllers.module';
import { AuthModule as InfraAuthModule } from './infrastructure/auth/auth.module';
import { PersistenceModule } from './infrastructure/persistence/persistence.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    InfraAuthModule,
    GatewayAuthModule,
    PersistenceModule,
    ControllersModule,
    UseCasesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
