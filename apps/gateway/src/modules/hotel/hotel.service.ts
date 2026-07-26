import { Inject, Injectable, InternalServerErrorException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { status } from '@grpc/grpc-js';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AI_PACKAGE } from '../ai-client/ai-client.module';
import { AiServiceGrpcClient } from '../ai-client/ai-service.interface';
import { HOTEL_PACKAGE } from '../hotel-client/hotel-client.module';
import { HotelResponse, HotelServiceGrpcClient } from '../hotel-client/hotel-service.interface';

@Injectable()
export class HotelService implements OnModuleInit {
  private hotelClient: HotelServiceGrpcClient;
  private aiClient: AiServiceGrpcClient;

  constructor(
    @Inject(HOTEL_PACKAGE) private readonly hotelClientProxy: ClientGrpc,
    @Inject(AI_PACKAGE) private readonly aiClientProxy: ClientGrpc,
  ) {}

  onModuleInit() {
    this.hotelClient = this.hotelClientProxy.getService<HotelServiceGrpcClient>('HotelService');
    this.aiClient = this.aiClientProxy.getService<AiServiceGrpcClient>('AiService');
  }

  async listHotels(country: string, city: string, personalityAnalysis: string): Promise<HotelResponse[]> {
    const response = await firstValueFrom(this.hotelClient.listHotels({ country, city }));
    if (response.hotels.length === 0) {
      return [];
    }

    const recommendation = await firstValueFrom(
      this.aiClient.recommendHotels({
        country,
        city,
        personalityAnalysis,
        hotels: JSON.stringify(response.hotels),
      }),
    );

    try {
      return JSON.parse(recommendation.result) as HotelResponse[];
    } catch {
      throw new InternalServerErrorException('ai-service geçerli bir otel önerisi döndürmedi');
    }
  }

  getHotelById(id: string): Promise<HotelResponse> {
    return this.callAndMapErrors(() => firstValueFrom(this.hotelClient.getHotelById({ id })));
  }

  private async callAndMapErrors<T>(call: () => Promise<T>): Promise<T> {
    try {
      return await call();
    } catch (error) {
      const grpcError = error as { code?: number; details?: string };
      if (grpcError.code === status.NOT_FOUND) {
        throw new NotFoundException(grpcError.details ?? 'Otel bulunamadı');
      }
      throw error;
    }
  }
}
