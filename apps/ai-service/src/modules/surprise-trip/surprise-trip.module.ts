import { Module } from '@nestjs/common';
import { GeminiModule } from '../gemini/gemini.module';
import { SurpriseTripController } from './surprise-trip.controller';
import { SurpriseTripService } from './surprise-trip.service';

@Module({
  imports: [GeminiModule],
  controllers: [SurpriseTripController],
  providers: [SurpriseTripService],
})
export class SurpriseTripModule {}
