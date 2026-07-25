import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { AiService, AttractionCandidate, RestaurantCandidate } from './ai.service';

interface AnalyzeTravelPersonalityRequest {
  answers: string;
}

interface GenerateTravelRouteRequest {
  country: string;
  city: string;
  personality: string;
}

interface RecommendRestaurantsRequest {
  country: string;
  city: string;
  personalityAnalysis: string;
  restaurants: string;
}

interface RecommendAttractionsRequest {
  country: string;
  city: string;
  personalityAnalysis: string;
  attractions: string;
}

@Controller()
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @GrpcMethod('AiService', 'AnalyzeTravelPersonality')
  async analyzeTravelPersonality(data: AnalyzeTravelPersonalityRequest) {
    try {
      const answers = JSON.parse(data.answers) as Record<string, unknown>;
      const analysis = await this.aiService.analyzeTravelPersonality(answers);
      return { analysis };
    } catch (error) {
      throw new RpcException({ code: status.INTERNAL, message: (error as Error).message });
    }
  }

  @GrpcMethod('AiService', 'GenerateTravelRoute')
  async generateTravelRoute(data: GenerateTravelRouteRequest) {
    try {
      const personality = JSON.parse(data.personality) as Record<string, unknown>;
      const route = await this.aiService.generateTravelRoute(data.country, data.city, personality);
      return { result: JSON.stringify(route) };
    } catch (error) {
      throw new RpcException({ code: status.INTERNAL, message: (error as Error).message });
    }
  }

  @GrpcMethod('AiService', 'RecommendRestaurants')
  async recommendRestaurants(data: RecommendRestaurantsRequest) {
    try {
      const restaurants = JSON.parse(data.restaurants) as RestaurantCandidate[];
      const recommended = await this.aiService.recommendRestaurants(
        data.country,
        data.city,
        data.personalityAnalysis,
        restaurants,
      );
      return { result: JSON.stringify(recommended) };
    } catch (error) {
      throw new RpcException({ code: status.INTERNAL, message: (error as Error).message });
    }
  }

  @GrpcMethod('AiService', 'RecommendAttractions')
  async recommendAttractions(data: RecommendAttractionsRequest) {
    try {
      const attractions = JSON.parse(data.attractions) as AttractionCandidate[];
      const recommended = await this.aiService.recommendAttractions(
        data.country,
        data.city,
        data.personalityAnalysis,
        attractions,
      );
      return { result: JSON.stringify(recommended) };
    } catch (error) {
      throw new RpcException({ code: status.INTERNAL, message: (error as Error).message });
    }
  }
}
