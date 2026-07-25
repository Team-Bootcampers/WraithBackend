import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './modules/health/health.controller';
import { AiModule } from './modules/ai/ai.module';
import { HotelModule } from './modules/hotel/hotel.module';
import { RestaurantModule } from './modules/restaurant/restaurant.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UserModule, AiModule, HotelModule, RestaurantModule],
  controllers: [HealthController],
})
export class AppModule {}
