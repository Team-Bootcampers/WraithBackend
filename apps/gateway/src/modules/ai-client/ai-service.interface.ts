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

export interface RecommendRestaurantsRequest {
  country: string;
  city: string;
  personalityAnalysis: string;
  // JSON.stringify edilmiş aday restoran listesi (RestaurantResponse[]).
  restaurants: string;
}

export interface RecommendRestaurantsResponse {
  // JSON.stringify edilmiş, kişiliğe uygun seçilmiş restoran listesi (RestaurantResponse[]).
  result: string;
}

export interface RecommendAttractionsRequest {
  country: string;
  city: string;
  personalityAnalysis: string;
  // JSON.stringify edilmiş aday gezilecek yer listesi (AttractionResponse[]).
  attractions: string;
}

export interface RecommendAttractionsResponse {
  // JSON.stringify edilmiş, kişiliğe uygun seçilmiş gezilecek yer listesi (AttractionResponse[]).
  result: string;
}

export interface RecommendHotelsRequest {
  country: string;
  city: string;
  personalityAnalysis: string;
  // JSON.stringify edilmiş aday otel listesi (HotelResponse[]).
  hotels: string;
}

export interface RecommendHotelsResponse {
  // JSON.stringify edilmiş, kişiliğe uygun seçilmiş otel listesi (HotelResponse[]).
  result: string;
}

export interface RecommendTripsRequest {
  personalityAnalysis: string;
  // JSON.stringify edilmiş aday (public) seyahat listesi (trip-service'ten gelen TripResponse[]).
  trips: string;
}

export interface RecommendTripsResponse {
  // JSON.stringify edilmiş, kişiliğe uygun sıralanmış seyahat listesi (TripResponse[] ile aynı şema).
  result: string;
}

export interface AiServiceGrpcClient {
  analyzeTravelPersonality(data: AnalyzeTravelPersonalityRequest): Observable<AnalyzeTravelPersonalityResponse>;
  generateTravelRoute(data: GenerateTravelRouteRequest): Observable<GenerateTravelRouteResponse>;
  recommendRestaurants(data: RecommendRestaurantsRequest): Observable<RecommendRestaurantsResponse>;
  recommendAttractions(data: RecommendAttractionsRequest): Observable<RecommendAttractionsResponse>;
  recommendHotels(data: RecommendHotelsRequest): Observable<RecommendHotelsResponse>;
  recommendTrips(data: RecommendTripsRequest): Observable<RecommendTripsResponse>;
}

export interface PlanTripRequest {
  characterAnalysis: string;
  // JSON.stringify edilmiş onboarding cevapları.
  onboardingAnswers: string;
  // JSON.stringify edilmiş seyahat verisi (travelerCount + stops[]).
  trip: string;
}

export interface PlanTripResponse {
  // JSON.stringify edilmiş TripPlanResponseDto sonucu.
  result: string;
}

export interface TripPlanningServiceGrpcClient {
  planTrip(data: PlanTripRequest): Observable<PlanTripResponse>;
}
