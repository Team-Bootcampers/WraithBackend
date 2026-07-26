import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.TRIP_GRPC_PORT ?? '5006';

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'trip',
      protoPath: join(process.cwd(), 'proto/trip/trip.proto'),
      url: `0.0.0.0:${port}`,
      loader: { enums: String },
    },
  });

  await app.listen();
  console.log(`trip-service gRPC listening on 0.0.0.0:${port}`);
}

bootstrap();
