import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttractionEntity } from './modules/attraction/entities/attraction.entity';
import { AttractionModule } from './modules/attraction/attraction.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('ATTRACTION_DB_HOST'),
        port: config.get<number>('ATTRACTION_DB_PORT'),
        username: config.get<string>('ATTRACTION_DB_USER'),
        password: config.get<string>('ATTRACTION_DB_PASSWORD'),
        database: config.get<string>('ATTRACTION_DB_NAME'),
        entities: [AttractionEntity],
        // Dev kolaylığı için açık. Prod'a geçerken migration'lara taşınmalı.
        synchronize: config.get<string>('NODE_ENV') !== 'production',
      }),
    }),
    AttractionModule,
  ],
})
export class AppModule {}
