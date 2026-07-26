import { Module } from '@nestjs/common';
import { AiClientModule } from '../ai-client/ai-client.module';
import { HotelClientModule } from '../hotel-client/hotel-client.module';
import { HotelController } from './hotel.controller';
import { HotelService } from './hotel.service';

@Module({
  imports: [HotelClientModule, AiClientModule],
  controllers: [HotelController],
  providers: [HotelService],
})
export class HotelModule {}
