import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const TRIP_PACKAGE = 'TRIP_PACKAGE';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: TRIP_PACKAGE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'trip',
            protoPath: join(process.cwd(), 'proto/trip/trip.proto'),
            url: config.get<string>('TRIP_SERVICE_GRPC_URL'),
            loader: { enums: String },
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class TripClientModule {}
