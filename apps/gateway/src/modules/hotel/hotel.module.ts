import { Module } from '@nestjs/common';
import { HotelClientModule } from '../hotel-client/hotel-client.module';
import { HotelController } from './hotel.controller';
import { HotelService } from './hotel.service';

@Module({
  imports: [HotelClientModule],
  controllers: [HotelController],
  providers: [HotelService],
})
export class HotelModule {}
