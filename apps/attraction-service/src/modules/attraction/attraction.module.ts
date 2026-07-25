import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttractionEntity } from './entities/attraction.entity';
import { AttractionController } from './attraction.controller';
import { AttractionService } from './attraction.service';

@Module({
  imports: [TypeOrmModule.forFeature([AttractionEntity])],
  controllers: [AttractionController],
  providers: [AttractionService],
})
export class AttractionModule {}
