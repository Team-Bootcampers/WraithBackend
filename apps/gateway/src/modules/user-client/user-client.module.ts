import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const USER_PACKAGE = 'USER_PACKAGE';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: USER_PACKAGE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'user',
            protoPath: join(process.cwd(), 'proto/user/user.proto'),
            url: config.get<string>('USER_SERVICE_GRPC_URL'),
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class UserClientModule {}
