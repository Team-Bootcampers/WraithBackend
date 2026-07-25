import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GeminiClientService } from './gemini-client.service';

@Module({
  imports: [HttpModule],
  providers: [GeminiClientService],
  exports: [GeminiClientService],
})
export class GeminiModule {}
