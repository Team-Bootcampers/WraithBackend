import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './modules/user/entities/user.entity';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('USER_DB_HOST'),
        port: config.get<number>('USER_DB_PORT'),
        username: config.get<string>('USER_DB_USER'),
        password: config.get<string>('USER_DB_PASSWORD'),
        database: config.get<string>('USER_DB_NAME'),
        entities: [UserEntity],
        // Dev kolaylığı için açık. Prod'a geçerken migration'lara taşınmalı.
        synchronize: config.get<string>('NODE_ENV') !== 'production',
      }),
    }),
    UserModule,
  ],
})
export class AppModule {}
