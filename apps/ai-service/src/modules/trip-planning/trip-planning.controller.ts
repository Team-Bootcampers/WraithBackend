import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { TripPlanningService } from './trip-planning.service';
import { TripSnapshot } from './trip-planning.types';

interface PlanTripRequest {
  characterAnalysis: string;
  onboardingAnswers: string;
  trip: string;
}

@Controller()
export class TripPlanningController {
  constructor(private readonly tripPlanningService: TripPlanningService) {}

  @GrpcMethod('TripPlanningService', 'PlanTrip')
  async planTrip(data: PlanTripRequest) {
    try {
      const onboardingAnswers = JSON.parse(data.onboardingAnswers) as Record<string, unknown>;
      const trip = JSON.parse(data.trip) as TripSnapshot;

      const result = await this.tripPlanningService.planTrip({
        characterAnalysis: data.characterAnalysis,
        onboardingAnswers,
        trip,
      });

      return { result: JSON.stringify(result) };
    } catch (error) {
      throw new RpcException({ code: status.INTERNAL, message: (error as Error).message });
    }
  }
}
