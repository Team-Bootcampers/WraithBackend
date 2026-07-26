import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { status } from '@grpc/grpc-js';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AI_PACKAGE } from '../ai-client/ai-client.module';
import { AiServiceGrpcClient } from '../ai-client/ai-service.interface';
import { TRIP_PACKAGE } from '../trip-client/trip-client.module';
import { TripResponse, TripServiceGrpcClient } from '../trip-client/trip-service.interface';
import { CreateTripDto } from './dto/create-trip.dto';
import { DeleteTripDto } from './dto/delete-trip.dto';
import { ListTripsQueryDto } from './dto/list-trips-query.dto';
import { PublishTripDto } from './dto/publish-trip.dto';
import { TripResponseDto } from './dto/trip-response.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { VoteTripDto } from './dto/vote-trip.dto';

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

  async createTrip(dto: CreateTripDto): Promise<TripResponseDto> {
    const trip = await firstValueFrom(
      this.tripClient.createTrip({
        userId: dto.userId,
        isPublic: dto.isPublic ?? false,
        stops: dto.stops.map((stop) => ({
          ...stop,
          endDate: stop.endDate ?? '',
        })),
      }),
    );
    return this.toResponseDto(trip);
  }

  async getTripById(id: string): Promise<TripResponseDto> {
    const trip = await this.callAndMapErrors(() => firstValueFrom(this.tripClient.getTripById({ id })));
    return this.toResponseDto(trip);
  }

  async publishTrip(id: string, dto: PublishTripDto): Promise<TripResponseDto> {
    const trip = await this.callAndMapErrors(() =>
      firstValueFrom(this.tripClient.publishTrip({ id, title: dto.title, description: dto.description })),
    );
    return this.toResponseDto(trip);
  }

  async voteTrip(id: string, dto: VoteTripDto): Promise<TripResponseDto> {
    const trip = await this.callAndMapErrors(() =>
      firstValueFrom(this.tripClient.voteTrip({ id, userId: dto.userId, score: dto.score })),
    );
    return this.toResponseDto(trip);
  }

  async updateTrip(id: string, dto: UpdateTripDto): Promise<TripResponseDto> {
    const trip = await this.callAndMapErrors(() =>
      firstValueFrom(
        this.tripClient.updateTrip({
          id,
          userId: dto.userId,
          stops: (dto.stops ?? []).map((stop) => ({ ...stop, endDate: stop.endDate ?? '' })),
          hasStops: dto.stops !== undefined,
          isPublic: dto.isPublic ?? false,
          hasIsPublic: dto.isPublic !== undefined,
          title: dto.title ?? '',
          hasTitle: dto.title !== undefined,
          description: dto.description ?? '',
          hasDescription: dto.description !== undefined,
        }),
      ),
    );
    return this.toResponseDto(trip);
  }

  async deleteTrip(id: string, dto: DeleteTripDto): Promise<void> {
    await this.callAndMapErrors(() => firstValueFrom(this.tripClient.deleteTrip({ id, userId: dto.userId })));
  }

  async listTrips(query: ListTripsQueryDto): Promise<TripResponseDto[]> {
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

      let recommended: TripResponse[];
      try {
        recommended = JSON.parse(recommendation.result) as TripResponse[];
      } catch {
        throw new InternalServerErrorException('ai-service geçerli bir seyahat önerisi döndürmedi');
      }
      return recommended.map((trip) => this.toResponseDto(trip));
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
    return response.trips.map((trip) => this.toResponseDto(trip));
  }

  private toResponseDto(trip: TripResponse): TripResponseDto {
    return {
      ...trip,
      coverImage: this.resolveCoverImage(trip),
      durationDays: this.resolveDurationDays(trip),
    };
  }

  // İlk durağın ilk otelinden, yoksa gezilecek yerinden, yoksa restoranından ilk görsel; hiçbiri yoksa sonraki duraklara bakılır.
  private resolveCoverImage(trip: TripResponse): string {
    for (const stop of trip.stops) {
      const image = stop.hotels[0]?.images[0] ?? stop.attractions[0]?.images[0] ?? stop.restaurants[0]?.images[0];
      if (image) {
        return image;
      }
    }
    return '';
  }

  // İlk durağın başlangıcından son durağın bitişine (yoksa başlangıcına) kadar toplam gün sayısı.
  private resolveDurationDays(trip: TripResponse): number {
    if (trip.stops.length === 0) {
      return 0;
    }

    const firstStop = trip.stops[0];
    const lastStop = trip.stops[trip.stops.length - 1];
    const start = new Date(firstStop.startDate);
    const end = new Date(lastStop.endDate || lastStop.startDate);

    const diffDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, diffDays);
  }

  private async callAndMapErrors<T>(call: () => Promise<T>): Promise<T> {
    try {
      return await call();
    } catch (error) {
      const grpcError = error as { code?: number; details?: string };
      if (grpcError.code === status.NOT_FOUND) {
        throw new NotFoundException(grpcError.details ?? 'Seyahat bulunamadı');
      }
      if (grpcError.code === status.INVALID_ARGUMENT) {
        throw new BadRequestException(grpcError.details ?? 'Geçersiz istek');
      }
      if (grpcError.code === status.PERMISSION_DENIED) {
        throw new ForbiddenException(grpcError.details ?? 'Bu işlem için yetkiniz yok');
      }
      throw error;
    }
  }
}
