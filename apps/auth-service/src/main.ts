import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('CoreBackendKit — Auth Service')
    .setDescription('Kullanıcı sign up / login uç noktaları (Firebase Auth tabanlı)')
    .setVersion('0.1.0')
    .addTag('auth')
    // Gateway üzerinden erişimde Swagger UI'ın doğru base URL'i kullanması için.
    // Yeni bir HTTP servis eklendiğinde bu servis de kendi main.ts'inde
    // api.localhost'u server olarak tanımlamalıdır.
    .addServer('https://wraithathon.gokhansal.com', 'API Gateway')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // Swagger UI: /auth/docs  (servis içi doğrudan erişim için)
  // OpenAPI JSON: /auth/api-json  (gateway'in bu spec'i birleşik dokümana eklemesi için)
  SwaggerModule.setup('auth/docs', app, document, {
    jsonDocumentUrl: 'auth/api-json',
  });

  const port = Number(process.env.AUTH_HTTP_PORT ?? 3001);
  await app.listen(port, '0.0.0.0');
  console.log(`auth-service listening on http://localhost:${port}`);
  console.log(`Swagger docs (gateway): https://wraithathon.gokhansal.com/docs`);
  console.log(`Auth OpenAPI spec: http://localhost:${port}/auth/api-json`);
}

bootstrap();
