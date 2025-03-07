import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: [process.env.WEB_URL ?? 'http://localhost:3000'],
    credentials: true,
  });

  // Cookie parser
  app.use(cookieParser());

  // Versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.setGlobalPrefix('api');

  // Pipes validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Configuration for Swagger
  const config = new DocumentBuilder()
    .setTitle('Ms&M Consulting API')
    .setDescription('API for Ms&M Consulting')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  document.tags = [
    { name: 'Auth', description: 'Endpoints related to authentication' },
  ];

  SwaggerModule.setup('api', app, document);

  await app.listen(parseInt(process.env.PORT ?? '3000'));
}
bootstrap();
