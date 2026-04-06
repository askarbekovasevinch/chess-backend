import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.enableCors({
  //   origin: process.env.FRONTEND_URL || '*',
  //   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  //   allowedHeaders: ['Content-Type', 'Authorization'],
  // });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Chess Platform API')
    .setDescription('Chess Platform Backend REST API')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')

    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = process.env.PORT || 3333;
  await app.listen(port);
  console.log(`Server: http://localhost:${port}`);
  console.log(`Swagger: http://localhost:${port}/docs`);
}
bootstrap();
