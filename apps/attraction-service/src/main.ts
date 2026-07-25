import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.ATTRACTION_GRPC_PORT ?? '5005';

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'attraction',
      protoPath: join(process.cwd(), 'proto/attraction/attraction.proto'),
      url: `0.0.0.0:${port}`,
    },
  });

  await app.listen();
  console.log(`attraction-service gRPC listening on 0.0.0.0:${port}`);
}

bootstrap();
