import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TripEntity, TripStop } from './entities/trip.entity';

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
}
