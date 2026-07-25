import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotelEntity } from './modules/hotel/entities/hotel.entity';
import { HotelModule } from './modules/hotel/hotel.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('HOTEL_DB_HOST'),
        port: config.get<number>('HOTEL_DB_PORT'),
        username: config.get<string>('HOTEL_DB_USER'),
        password: config.get<string>('HOTEL_DB_PASSWORD'),
        database: config.get<string>('HOTEL_DB_NAME'),
        entities: [HotelEntity],
        // Dev kolaylığı için açık. Prod'a geçerken migration'lara taşınmalı.
        synchronize: config.get<string>('NODE_ENV') !== 'production',
      }),
    }),
    HotelModule,
  ],
})
export class AppModule {}
