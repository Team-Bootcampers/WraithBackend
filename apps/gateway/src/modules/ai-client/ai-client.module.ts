import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const AI_PACKAGE = 'AI_PACKAGE';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: AI_PACKAGE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'ai',
            protoPath: join(process.cwd(), 'proto/ai/ai.proto'),
            url: config.get<string>('AI_SERVICE_GRPC_URL'),
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class AiClientModule {}
