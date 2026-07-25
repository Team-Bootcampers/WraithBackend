import { Inject, Injectable, InternalServerErrorException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { status } from '@grpc/grpc-js';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AI_PACKAGE } from '../ai-client/ai-client.module';
import { AiServiceGrpcClient } from '../ai-client/ai-service.interface';
import { RESTAURANT_PACKAGE } from '../restaurant-client/restaurant-client.module';
import { RestaurantResponse, RestaurantServiceGrpcClient } from '../restaurant-client/restaurant-service.interface';

@Injectable()
export class RestaurantService implements OnModuleInit {
  private restaurantClient: RestaurantServiceGrpcClient;
  private aiClient: AiServiceGrpcClient;

  constructor(
    @Inject(RESTAURANT_PACKAGE) private readonly restaurantClientProxy: ClientGrpc,
    @Inject(AI_PACKAGE) private readonly aiClientProxy: ClientGrpc,
  ) {}

  onModuleInit() {
    this.restaurantClient = this.restaurantClientProxy.getService<RestaurantServiceGrpcClient>('RestaurantService');
    this.aiClient = this.aiClientProxy.getService<AiServiceGrpcClient>('AiService');
  }

  async listRestaurants(country: string, city: string, personalityAnalysis: string): Promise<RestaurantResponse[]> {
    const response = await firstValueFrom(this.restaurantClient.listRestaurants({ country, city }));
    if (response.restaurants.length === 0) {
      return [];
    }

    const recommendation = await firstValueFrom(
      this.aiClient.recommendRestaurants({
        country,
        city,
        personalityAnalysis,
        restaurants: JSON.stringify(response.restaurants),
      }),
    );

    try {
      return JSON.parse(recommendation.result) as RestaurantResponse[];
    } catch {
      throw new InternalServerErrorException('ai-service geçerli bir restoran önerisi döndürmedi');
    }
  }

  getRestaurantById(id: string): Promise<RestaurantResponse> {
    return this.callAndMapErrors(() => firstValueFrom(this.restaurantClient.getRestaurantById({ id })));
  }

  private async callAndMapErrors<T>(call: () => Promise<T>): Promise<T> {
    try {
      return await call();
    } catch (error) {
      const grpcError = error as { code?: number; details?: string };
      if (grpcError.code === status.NOT_FOUND) {
        throw new NotFoundException(grpcError.details ?? 'Restoran bulunamadı');
      }
      throw error;
    }
  }
}
