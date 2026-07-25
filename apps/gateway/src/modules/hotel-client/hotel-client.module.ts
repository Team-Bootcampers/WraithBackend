import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const HOTEL_PACKAGE = 'HOTEL_PACKAGE';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: HOTEL_PACKAGE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'hotel',
            protoPath: join(process.cwd(), 'proto/hotel/hotel.proto'),
            url: config.get<string>('HOTEL_SERVICE_GRPC_URL'),
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class HotelClientModule {}
