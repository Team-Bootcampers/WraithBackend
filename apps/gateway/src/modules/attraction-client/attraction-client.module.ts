import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const ATTRACTION_PACKAGE = 'ATTRACTION_PACKAGE';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: ATTRACTION_PACKAGE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'attraction',
            protoPath: join(process.cwd(), 'proto/attraction/attraction.proto'),
            url: config.get<string>('ATTRACTION_SERVICE_GRPC_URL'),
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class AttractionClientModule {}
