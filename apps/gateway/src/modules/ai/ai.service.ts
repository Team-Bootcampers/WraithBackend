import { Inject, Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AI_PACKAGE } from '../ai-client/ai-client.module';
import {
  AiServiceGrpcClient,
  SurpriseTripServiceGrpcClient,
  TripPlanningServiceGrpcClient,
} from '../ai-client/ai-service.interface';
import { OnboardingAnswersDto } from '../user/dto/save-onboarding.dto';
import { TravelRouteResponseDto } from './dto/generate-travel-route.dto';
import { GenerateSurpriseTripDto, SurpriseTripResponseDto } from './dto/surprise-trip.dto';
import { PlanTripDto, TripPlanResponseDto } from './dto/trip-planning.dto';

@Injectable()
export class AiService implements OnModuleInit {
  private aiClient: AiServiceGrpcClient;
  private tripPlanningClient: TripPlanningServiceGrpcClient;
  private surpriseTripClient: SurpriseTripServiceGrpcClient;

  constructor(@Inject(AI_PACKAGE) private readonly aiClientProxy: ClientGrpc) {}

  onModuleInit() {
    this.aiClient = this.aiClientProxy.getService<AiServiceGrpcClient>('AiService');
    this.tripPlanningClient = this.aiClientProxy.getService<TripPlanningServiceGrpcClient>('TripPlanningService');
    this.surpriseTripClient = this.aiClientProxy.getService<SurpriseTripServiceGrpcClient>('SurpriseTripService');
  }

  async analyzeTravelPersonality(answers: OnboardingAnswersDto): Promise<string> {
    const response = await firstValueFrom(
      this.aiClient.analyzeTravelPersonality({ answers: JSON.stringify(answers) }),
    );
    return response.analysis;
  }

  async generateTravelRoute(
    country: string,
    city: string,
    personality: OnboardingAnswersDto,
  ): Promise<TravelRouteResponseDto> {
    const response = await firstValueFrom(
      this.aiClient.generateTravelRoute({ country, city, personality: JSON.stringify(personality) }),
    );

    try {
      return JSON.parse(response.result) as TravelRouteResponseDto;
    } catch {
      throw new InternalServerErrorException('ai-service geçerli bir seyahat rotası döndürmedi');
    }
  }

  async planTrip(dto: PlanTripDto): Promise<TripPlanResponseDto> {
    const response = await firstValueFrom(
      this.tripPlanningClient.planTrip({
        characterAnalysis: dto.characterAnalysis,
        onboardingAnswers: JSON.stringify(dto.onboardingAnswers),
        trip: JSON.stringify(dto.trip),
      }),
    );

    try {
      return JSON.parse(response.result) as TripPlanResponseDto;
    } catch {
      throw new InternalServerErrorException('ai-service geçerli bir seyahat planı döndürmedi');
    }
  }

  async generateSurpriseTrip(dto: GenerateSurpriseTripDto): Promise<SurpriseTripResponseDto> {
    const { characterAnalysis, onboardingAnswers, ...request } = dto;

    const response = await firstValueFrom(
      this.surpriseTripClient.generateSurpriseTrip({
        characterAnalysis,
        onboardingAnswers: JSON.stringify(onboardingAnswers),
        request: JSON.stringify(request),
      }),
    );

    try {
      return JSON.parse(response.result) as SurpriseTripResponseDto;
    } catch {
      throw new InternalServerErrorException('ai-service geçerli bir sürpriz seyahat planı döndürmedi');
    }
  }
}
