import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripEntity } from './modules/trip/entities/trip.entity';
import { TripVoteEntity } from './modules/trip/entities/trip-vote.entity';
import { TripModule } from './modules/trip/trip.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('TRIP_DB_HOST'),
        port: config.get<number>('TRIP_DB_PORT'),
        username: config.get<string>('TRIP_DB_USER'),
        password: config.get<string>('TRIP_DB_PASSWORD'),
        database: config.get<string>('TRIP_DB_NAME'),
        entities: [TripEntity, TripVoteEntity],
        // Dev kolaylığı için açık. Prod'a geçerken migration'lara taşınmalı.
        synchronize: config.get<string>('NODE_ENV') !== 'production',
      }),
    }),
    TripModule,
  ],
})
export class AppModule {}
