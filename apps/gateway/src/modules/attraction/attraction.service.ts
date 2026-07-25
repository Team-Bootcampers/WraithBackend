import { Inject, Injectable, InternalServerErrorException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { status } from '@grpc/grpc-js';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AI_PACKAGE } from '../ai-client/ai-client.module';
import { AiServiceGrpcClient } from '../ai-client/ai-service.interface';
import { ATTRACTION_PACKAGE } from '../attraction-client/attraction-client.module';
import { AttractionResponse, AttractionServiceGrpcClient } from '../attraction-client/attraction-service.interface';

@Injectable()
export class AttractionService implements OnModuleInit {
  private attractionClient: AttractionServiceGrpcClient;
  private aiClient: AiServiceGrpcClient;

  constructor(
    @Inject(ATTRACTION_PACKAGE) private readonly attractionClientProxy: ClientGrpc,
    @Inject(AI_PACKAGE) private readonly aiClientProxy: ClientGrpc,
  ) {}

  onModuleInit() {
    this.attractionClient = this.attractionClientProxy.getService<AttractionServiceGrpcClient>('AttractionService');
    this.aiClient = this.aiClientProxy.getService<AiServiceGrpcClient>('AiService');
  }

  async listAttractions(country: string, city: string, personalityAnalysis: string): Promise<AttractionResponse[]> {
    const response = await firstValueFrom(this.attractionClient.listAttractions({ country, city }));
    if (response.attractions.length === 0) {
      return [];
    }

    const recommendation = await firstValueFrom(
      this.aiClient.recommendAttractions({
        country,
        city,
        personalityAnalysis,
        attractions: JSON.stringify(response.attractions),
      }),
    );

    try {
      return JSON.parse(recommendation.result) as AttractionResponse[];
    } catch {
      throw new InternalServerErrorException('ai-service geçerli bir gezilecek yer önerisi döndürmedi');
    }
  }

  getAttractionById(id: string): Promise<AttractionResponse> {
    return this.callAndMapErrors(() => firstValueFrom(this.attractionClient.getAttractionById({ id })));
  }

  private async callAndMapErrors<T>(call: () => Promise<T>): Promise<T> {
    try {
      return await call();
    } catch (error) {
      const grpcError = error as { code?: number; details?: string };
      if (grpcError.code === status.NOT_FOUND) {
        throw new NotFoundException(grpcError.details ?? 'Gezilecek yer bulunamadı');
      }
      throw error;
    }
  }
}
