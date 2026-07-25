import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiModule } from './modules/ai/ai.module';
import { TripPlanningModule } from './modules/trip-planning/trip-planning.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AiModule, TripPlanningModule],
})
export class AppModule {}
