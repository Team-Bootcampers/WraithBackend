import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.RESTAURANT_GRPC_PORT ?? '5004';

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'restaurant',
      protoPath: join(process.cwd(), 'proto/restaurant/restaurant.proto'),
      url: `0.0.0.0:${port}`,
    },
  });

  await app.listen();
  console.log(`restaurant-service gRPC listening on 0.0.0.0:${port}`);
}

bootstrap();
