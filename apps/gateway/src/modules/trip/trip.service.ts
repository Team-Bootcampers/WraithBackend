import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { status } from '@grpc/grpc-js';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AI_PACKAGE } from '../ai-client/ai-client.module';
import { AiServiceGrpcClient } from '../ai-client/ai-service.interface';
import { TRIP_PACKAGE } from '../trip-client/trip-client.module';
import { TripResponse, TripServiceGrpcClient } from '../trip-client/trip-service.interface';
import { CreateTripDto } from './dto/create-trip.dto';
import { ListTripsQueryDto } from './dto/list-trips-query.dto';

@Injectable()
export class TripService implements OnModuleInit {
  private tripClient: TripServiceGrpcClient;
  private aiClient: AiServiceGrpcClient;

  constructor(
    @Inject(TRIP_PACKAGE) private readonly tripClientProxy: ClientGrpc,
    @Inject(AI_PACKAGE) private readonly aiClientProxy: ClientGrpc,
  ) {}

  onModuleInit() {
    this.tripClient = this.tripClientProxy.getService<TripServiceGrpcClient>('TripService');
    this.aiClient = this.aiClientProxy.getService<AiServiceGrpcClient>('AiService');
  }

  createTrip(dto: CreateTripDto): Promise<TripResponse> {
    return firstValueFrom(
      this.tripClient.createTrip({
        userId: dto.userId,
        isPublic: dto.isPublic ?? false,
        stops: dto.stops.map((stop) => ({
          ...stop,
          endDate: stop.endDate ?? '',
        })),
      }),
    );
  }

  getTripById(id: string): Promise<TripResponse> {
    return this.callAndMapErrors(() => firstValueFrom(this.tripClient.getTripById({ id })));
  }

  async listTrips(query: ListTripsQueryDto): Promise<TripResponse[]> {
    if (query.personalized) {
      if (!query.userId || !query.personalityAnalysis) {
        throw new BadRequestException('personalized=true için userId ve personalityAnalysis zorunludur');
      }

      const candidates = await firstValueFrom(
        this.tripClient.listTrips({
          onlyPublic: true,
          country: query.country,
          cityName: query.city,
        }),
      );

      if (candidates.trips.length === 0) {
        return [];
      }

      const recommendation = await firstValueFrom(
        this.aiClient.recommendTrips({
          personalityAnalysis: query.personalityAnalysis,
          trips: JSON.stringify(candidates.trips),
        }),
      );

      try {
        return JSON.parse(recommendation.result) as TripResponse[];
      } catch {
        throw new InternalServerErrorException('ai-service geçerli bir seyahat önerisi döndürmedi');
      }
    }

    const response = await firstValueFrom(
      this.tripClient.listTrips({
        userId: query.userId,
        onlyPublic: query.isPublic,
        sortByPopularity: query.popular,
        country: query.country,
        cityName: query.city,
      }),
    );
    return response.trips;
  }

  private async callAndMapErrors<T>(call: () => Promise<T>): Promise<T> {
    try {
      return await call();
    } catch (error) {
      const grpcError = error as { code?: number; details?: string };
      if (grpcError.code === status.NOT_FOUND) {
        throw new NotFoundException(grpcError.details ?? 'Seyahat bulunamadı');
      }
      throw error;
    }
  }
}
