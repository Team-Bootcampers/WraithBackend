import { Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { status } from '@grpc/grpc-js';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { HOTEL_PACKAGE } from '../hotel-client/hotel-client.module';
import { HotelResponse, HotelServiceGrpcClient } from '../hotel-client/hotel-service.interface';

@Injectable()
export class HotelService implements OnModuleInit {
  private hotelClient: HotelServiceGrpcClient;

  constructor(@Inject(HOTEL_PACKAGE) private readonly hotelClientProxy: ClientGrpc) {}

  onModuleInit() {
    this.hotelClient = this.hotelClientProxy.getService<HotelServiceGrpcClient>('HotelService');
  }

  async listHotels(country: string, city: string): Promise<HotelResponse[]> {
    const response = await firstValueFrom(this.hotelClient.listHotels({ country, city }));
    return response.hotels;
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
