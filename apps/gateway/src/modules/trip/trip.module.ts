import { Module } from '@nestjs/common';
import { AiClientModule } from '../ai-client/ai-client.module';
import { TripClientModule } from '../trip-client/trip-client.module';
import { TripController } from './trip.controller';
import { TripService } from './trip.service';

@Module({
  imports: [TripClientModule, AiClientModule],
  controllers: [TripController],
  providers: [TripService],
})
export class TripModule {}
