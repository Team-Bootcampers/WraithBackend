import { Controller, NotFoundException } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { TripEntity, TripStop } from './entities/trip.entity';
import { TripService } from './trip.service';

interface GrpcTripStop extends Omit<TripStop, 'endDate'> {
  endDate: string;
}

interface CreateTripRequest {
  userId: string;
  stops: GrpcTripStop[];
  isPublic: boolean;
}

interface GetTripByIdRequest {
  id: string;
}

interface ListTripsRequest {
  userId?: string;
  onlyPublic?: boolean;
  sortByPopularity?: boolean;
  country?: string;
  cityName?: string;
}

@Controller()
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @GrpcMethod('TripService', 'CreateTrip')
  async createTrip(data: CreateTripRequest) {
    const stops = data.stops.map((stop) => this.fromGrpcStop(stop));
    const trip = await this.tripService.createTrip(data.userId, stops, data.isPublic);
    return this.toResponse(trip);
  }

  @GrpcMethod('TripService', 'GetTripById')
  async getTripById(data: GetTripByIdRequest) {
    try {
      const trip = await this.tripService.getTripById(data.id);
      return this.toResponse(trip);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new RpcException({ code: status.NOT_FOUND, message: error.message });
      }
      throw new RpcException({ code: status.INTERNAL, message: error.message });
    }
  }

  @GrpcMethod('TripService', 'ListTrips')
  async listTrips(data: ListTripsRequest) {
    const trips = await this.tripService.listTrips({
      userId: data.userId || undefined,
      onlyPublic: data.onlyPublic,
      sortByPopularity: data.sortByPopularity,
      country: data.country || undefined,
      cityName: data.cityName || undefined,
    });

    return {
      trips: trips.map((trip) => this.toResponse(trip)),
      total: trips.length,
    };
  }

  private fromGrpcStop(stop: GrpcTripStop): TripStop {
    return {
      ...stop,
      endDate: stop.endDate ? stop.endDate : null,
    };
  }

  private toResponse(trip: TripEntity) {
    return {
      id: trip.id,
      userId: trip.userId,
      stopCount: trip.stopCount,
      stops: trip.stops.map((stop) => ({ ...stop, endDate: stop.endDate ?? '' })),
      isPublic: trip.isPublic,
      viewCount: trip.viewCount,
      createdAt: trip.createdAt.toISOString(),
      updatedAt: trip.updatedAt.toISOString(),
    };
  }
}
