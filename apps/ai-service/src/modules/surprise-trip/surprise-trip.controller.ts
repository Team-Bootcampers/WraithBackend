import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { SurpriseTripService } from './surprise-trip.service';
import { SurpriseTripRequestData } from './surprise-trip.types';

interface GenerateSurpriseTripRequest {
  characterAnalysis: string;
  onboardingAnswers: string;
  request: string;
}

@Controller()
export class SurpriseTripController {
  constructor(private readonly surpriseTripService: SurpriseTripService) {}

  @GrpcMethod('SurpriseTripService', 'GenerateSurpriseTrip')
  async generateSurpriseTrip(data: GenerateSurpriseTripRequest) {
    try {
      const onboardingAnswers = JSON.parse(data.onboardingAnswers) as Record<string, unknown>;
      const request = JSON.parse(data.request) as SurpriseTripRequestData;

      const result = await this.surpriseTripService.generateSurpriseTrip({
        characterAnalysis: data.characterAnalysis,
        onboardingAnswers,
        request,
      });

      return { result: JSON.stringify(result) };
    } catch (error) {
      throw new RpcException({ code: status.INTERNAL, message: (error as Error).message });
    }
  }
}
