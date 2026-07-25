import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.AI_GRPC_PORT ?? '5002';

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'ai',
      protoPath: join(process.cwd(), 'proto/ai/ai.proto'),
      url: `0.0.0.0:${port}`,
    },
  });

  await app.listen();
  console.log(`ai-service gRPC listening on 0.0.0.0:${port}`);
}

bootstrap();
