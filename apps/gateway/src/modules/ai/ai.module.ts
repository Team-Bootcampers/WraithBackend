import { Module } from '@nestjs/common';
import { AiClientModule } from '../ai-client/ai-client.module';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

@Module({
  imports: [AiClientModule],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
