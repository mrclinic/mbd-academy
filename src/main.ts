
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { LoggingInterceptor } from './common/logging.interceptor';
import { AllExceptionsFilter } from './common/all-exceptions.filter';
import { JoiValidationInterceptor } from './validation/joi-validation.interceptor';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(express.json());
  app.enableCors();

  // serve uploaded files
  app.use('/uploads', express.static('uploads'));

  // Prisma shutdown hooks
  /* const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app); */

  // Global interceptor & filters
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global Joi validation interceptor (will pick up @JoiSchema metadata)
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new JoiValidationInterceptor(reflector));

  const config = new DocumentBuilder()
    .setTitle('MBD Academy API')
    .setDescription('MBD Academy using NestJS, Prisma, Postgres, Swagger, Joi, JWT auth, roles, logging, filters')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, doc, {
    jsonDocumentUrl: 'api-json', // Exposes JSON at /api-json
  });

  // Read port from env
  const port = parseInt(process.env.PORT, 10) || 3000;
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
