import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.HOTEL_GRPC_PORT ?? '5003';

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'hotel',
      protoPath: join(process.cwd(), 'proto/hotel/hotel.proto'),
      url: `0.0.0.0:${port}`,
    },
  });

  await app.listen();
  console.log(`hotel-service gRPC listening on 0.0.0.0:${port}`);
}

bootstrap();
