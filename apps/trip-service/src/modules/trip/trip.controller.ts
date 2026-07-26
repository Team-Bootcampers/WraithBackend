import { BadRequestException, Controller, ForbiddenException, NotFoundException } from '@nestjs/common';
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

interface PublishTripRequest {
  id: string;
  title: string;
  description: string;
}

interface VoteTripRequest {
  id: string;
  userId: string;
  score: number;
}

interface UpdateTripRequest {
  id: string;
  userId: string;
  stops: GrpcTripStop[];
  hasStops: boolean;
  isPublic: boolean;
  hasIsPublic: boolean;
  title: string;
  hasTitle: boolean;
  description: string;
  hasDescription: boolean;
}

interface DeleteTripRequest {
  id: string;
  userId: string;
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

  @GrpcMethod('TripService', 'PublishTrip')
  async publishTrip(data: PublishTripRequest) {
    try {
      const trip = await this.tripService.publishTrip(data.id, data.title, data.description);
      return this.toResponse(trip);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new RpcException({ code: status.NOT_FOUND, message: error.message });
      }
      throw new RpcException({ code: status.INTERNAL, message: error.message });
    }
  }

  @GrpcMethod('TripService', 'VoteTrip')
  async voteTrip(data: VoteTripRequest) {
    try {
      const trip = await this.tripService.voteTrip(data.id, data.userId, data.score);
      return this.toResponse(trip);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new RpcException({ code: status.NOT_FOUND, message: error.message });
      }
      if (error instanceof BadRequestException) {
        throw new RpcException({ code: status.INVALID_ARGUMENT, message: error.message });
      }
      throw new RpcException({ code: status.INTERNAL, message: error.message });
    }
  }

  @GrpcMethod('TripService', 'UpdateTrip')
  async updateTrip(data: UpdateTripRequest) {
    try {
      const trip = await this.tripService.updateTrip(data.id, data.userId, {
        stops: data.hasStops ? data.stops.map((stop) => this.fromGrpcStop(stop)) : undefined,
        isPublic: data.hasIsPublic ? data.isPublic : undefined,
        title: data.hasTitle ? data.title : undefined,
        description: data.hasDescription ? data.description : undefined,
      });
      return this.toResponse(trip);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new RpcException({ code: status.NOT_FOUND, message: error.message });
      }
      if (error instanceof ForbiddenException) {
        throw new RpcException({ code: status.PERMISSION_DENIED, message: error.message });
      }
      throw new RpcException({ code: status.INTERNAL, message: error.message });
    }
  }

  @GrpcMethod('TripService', 'DeleteTrip')
  async deleteTrip(data: DeleteTripRequest) {
    try {
      await this.tripService.deleteTrip(data.id, data.userId);
      return { success: true };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new RpcException({ code: status.NOT_FOUND, message: error.message });
      }
      if (error instanceof ForbiddenException) {
        throw new RpcException({ code: status.PERMISSION_DENIED, message: error.message });
      }
      throw new RpcException({ code: status.INTERNAL, message: error.message });
    }
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
      title: trip.title ?? '',
      description: trip.description ?? '',
      viewCount: trip.viewCount,
      ratingAverage: trip.ratingAverage,
      ratingCount: trip.ratingCount,
      createdAt: trip.createdAt.toISOString(),
      updatedAt: trip.updatedAt.toISOString(),
    };
  }
}
