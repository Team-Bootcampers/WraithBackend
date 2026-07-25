import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.USER_GRPC_PORT ?? '5001';

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'user',
      protoPath: join(process.cwd(), 'proto/user/user.proto'),
      url: `0.0.0.0:${port}`,
    },
  });

  await app.listen();
  console.log(`user-service gRPC listening on 0.0.0.0:${port}`);
}

bootstrap();
