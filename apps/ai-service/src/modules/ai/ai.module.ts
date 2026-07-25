import { Module } from '@nestjs/common';
import { GeminiModule } from '../gemini/gemini.module';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

@Module({
  imports: [GeminiModule],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
