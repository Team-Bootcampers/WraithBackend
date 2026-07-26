import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripEntity } from './entities/trip.entity';
import { TripVoteEntity } from './entities/trip-vote.entity';
import { TripController } from './trip.controller';
import { TripService } from './trip.service';

@Module({
  imports: [TypeOrmModule.forFeature([TripEntity, TripVoteEntity])],
  controllers: [TripController],
  providers: [TripService],
})
export class TripModule {}
