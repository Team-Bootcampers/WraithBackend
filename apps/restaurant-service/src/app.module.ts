import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantEntity } from './modules/restaurant/entities/restaurant.entity';
import { RestaurantModule } from './modules/restaurant/restaurant.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('RESTAURANT_DB_HOST'),
        port: config.get<number>('RESTAURANT_DB_PORT'),
        username: config.get<string>('RESTAURANT_DB_USER'),
        password: config.get<string>('RESTAURANT_DB_PASSWORD'),
        database: config.get<string>('RESTAURANT_DB_NAME'),
        entities: [RestaurantEntity],
        // Dev kolaylığı için açık. Prod'a geçerken migration'lara taşınmalı.
        synchronize: config.get<string>('NODE_ENV') !== 'production',
      }),
    }),
    RestaurantModule,
  ],
})
export class AppModule {}
