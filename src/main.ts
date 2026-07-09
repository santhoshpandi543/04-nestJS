import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips away properties not defined in the DTO
      forbidNonWhitelisted: true, // Throws an error if unknown properties are sent
      transform: true, // Automatically transforms payloads to match DTO types
    }),
  );

  //Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('Practice API')
    .setDescription('Practing..')
    .setVersion('1.0')
    // .addBearerAuth()  This enables accessToken verfication button 'Authorize'
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      displayRequestDuration: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
