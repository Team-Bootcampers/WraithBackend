import { Module } from '@nestjs/common';
import { AiClientModule } from '../ai-client/ai-client.module';
import { RestaurantClientModule } from '../restaurant-client/restaurant-client.module';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';

@Module({
  imports: [RestaurantClientModule, AiClientModule],
  controllers: [RestaurantController],
  providers: [RestaurantService],
})
export class RestaurantModule {}
