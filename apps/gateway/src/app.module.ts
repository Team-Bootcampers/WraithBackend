import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './modules/health/health.controller';
import { AiModule } from './modules/ai/ai.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UserModule, AiModule],
  controllers: [HealthController],
})
export class AppModule {}
