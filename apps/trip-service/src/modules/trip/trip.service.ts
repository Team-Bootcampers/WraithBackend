import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TripEntity, TripStop } from './entities/trip.entity';
import { TripVoteEntity } from './entities/trip-vote.entity';

export interface ListTripsFilter {
  userId?: string;
  onlyPublic?: boolean;
  sortByPopularity?: boolean;
  country?: string;
  cityName?: string;
}

@Injectable()
export class TripService {
  constructor(
    @InjectRepository(TripEntity)
    private readonly tripRepository: Repository<TripEntity>,
    @InjectRepository(TripVoteEntity)
    private readonly tripVoteRepository: Repository<TripVoteEntity>,
  ) {}

  async createTrip(userId: string, stops: TripStop[], isPublic: boolean): Promise<TripEntity> {
    const trip = this.tripRepository.create({
      userId,
      stops,
      stopCount: stops.length,
      isPublic,
    });
    return this.tripRepository.save(trip);
  }

  async getTripById(id: string): Promise<TripEntity> {
    const trip = await this.tripRepository.findOne({ where: { id } });
    if (!trip) {
      throw new NotFoundException(`Trip with id ${id} not found`);
    }

    // Popülerite metriği: her okuma view sayacını artırır.
    await this.tripRepository.increment({ id }, 'viewCount', 1);
    trip.viewCount += 1;
    return trip;
  }

  async listTrips(filter: ListTripsFilter): Promise<TripEntity[]> {
    const qb = this.tripRepository.createQueryBuilder('trip');

    if (filter.userId) {
      qb.andWhere('trip.user_id = :userId', { userId: filter.userId });
    }

    if (filter.onlyPublic) {
      qb.andWhere('trip.is_public = true');
    }

    if (filter.country) {
      qb.andWhere(
        `EXISTS (SELECT 1 FROM jsonb_array_elements(trip.stops) AS stop WHERE stop->>'country' = :country)`,
        { country: filter.country },
      );
    }

    if (filter.cityName) {
      qb.andWhere(
        `EXISTS (SELECT 1 FROM jsonb_array_elements(trip.stops) AS stop WHERE stop->>'cityName' = :cityName)`,
        { cityName: filter.cityName },
      );
    }

    if (filter.sortByPopularity) {
      qb.orderBy('trip.view_count', 'DESC');
    } else {
      qb.orderBy('trip.created_at', 'DESC');
    }

    return qb.getMany();
  }

  async publishTrip(id: string, title: string, description: string): Promise<TripEntity> {
    const trip = await this.tripRepository.findOne({ where: { id } });
    if (!trip) {
      throw new NotFoundException(`Trip with id ${id} not found`);
    }

    trip.isPublic = true;
    trip.title = title;
    trip.description = description;
    return this.tripRepository.save(trip);
  }

  async voteTrip(id: string, userId: string, score: number): Promise<TripEntity> {
    if (!Number.isInteger(score) || score < 1 || score > 5) {
      throw new BadRequestException('score 1 ile 5 arasında bir tam sayı olmalıdır');
    }

    const trip = await this.tripRepository.findOne({ where: { id } });
    if (!trip) {
      throw new NotFoundException(`Trip with id ${id} not found`);
    }

    const existingVote = await this.tripVoteRepository.findOne({ where: { tripId: id, userId } });
    if (existingVote) {
      existingVote.score = score;
      await this.tripVoteRepository.save(existingVote);
    } else {
      await this.tripVoteRepository.save(this.tripVoteRepository.create({ tripId: id, userId, score }));
    }

    const { average, count } = await this.tripVoteRepository
      .createQueryBuilder('vote')
      .select('AVG(vote.score)', 'average')
      .addSelect('COUNT(vote.id)', 'count')
      .where('vote.trip_id = :id', { id })
      .getRawOne<{ average: string; count: string }>()
      .then((raw) => ({ average: Number(raw?.average ?? 0), count: Number(raw?.count ?? 0) }));

    trip.ratingAverage = average;
    trip.ratingCount = count;
    return this.tripRepository.save(trip);
  }
}
