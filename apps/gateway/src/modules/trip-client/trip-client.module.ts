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
            // arrays: true olmadan boş bir "repeated" alan (ör. sonuç 0 seyahat döndürünce trips[])
            // wire'da hiç yer almadığından decode edilen objede undefined olarak kalır ve
            // response.trips.map(...) TypeError fırlatır; bu yüzden zorunlu.
            loader: { enums: String, arrays: true },
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class TripClientModule {}
