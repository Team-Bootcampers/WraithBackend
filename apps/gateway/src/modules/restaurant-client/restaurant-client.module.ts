import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const RESTAURANT_PACKAGE = 'RESTAURANT_PACKAGE';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: RESTAURANT_PACKAGE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'restaurant',
            protoPath: join(process.cwd(), 'proto/restaurant/restaurant.proto'),
            url: config.get<string>('RESTAURANT_SERVICE_GRPC_URL'),
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class RestaurantClientModule {}
