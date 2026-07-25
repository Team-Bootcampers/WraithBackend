import { Observable } from 'rxjs';

export interface AnalyzeTravelPersonalityRequest {
  answers: string;
}

export interface AnalyzeTravelPersonalityResponse {
  analysis: string;
}

export interface GenerateTravelRouteRequest {
  country: string;
  city: string;
  personality: string;
}

export interface GenerateTravelRouteResponse {
  result: string;
}

export interface AiServiceGrpcClient {
  analyzeTravelPersonality(data: AnalyzeTravelPersonalityRequest): Observable<AnalyzeTravelPersonalityResponse>;
  generateTravelRoute(data: GenerateTravelRouteRequest): Observable<GenerateTravelRouteResponse>;
}
