import { Module } from '@nestjs/common';
import { AiClientModule } from '../ai-client/ai-client.module';
import { AttractionClientModule } from '../attraction-client/attraction-client.module';
import { AttractionController } from './attraction.controller';
import { AttractionService } from './attraction.service';

@Module({
  imports: [AttractionClientModule, AiClientModule],
  controllers: [AttractionController],
  providers: [AttractionService],
})
export class AttractionModule {}
