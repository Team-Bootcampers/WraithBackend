import { Module } from '@nestjs/common';
import { GeminiModule } from '../gemini/gemini.module';
import { TripPlanningController } from './trip-planning.controller';
import { TripPlanningService } from './trip-planning.service';

@Module({
  imports: [GeminiModule],
  controllers: [TripPlanningController],
  providers: [TripPlanningService],
})
export class TripPlanningModule {}
