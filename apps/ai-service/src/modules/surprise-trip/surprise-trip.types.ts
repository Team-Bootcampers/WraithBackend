export type SurpriseScope = 'ANYWHERE' | 'DOMESTIC' | 'INTERNATIONAL';

export interface Country {
  name: string;
  iso2: string;
}

export interface Money {
  amount: number;
  currency: string;
}

export interface SurpriseTripRequestData {
  travelerCount: number;
  durationInDays: number;
  startDate: string;
  budget: Money;
  departureCountry: Country;
  departureCityName: string;
  surpriseScope: SurpriseScope;
  excludedCountryNames: string[];
}

export interface GenerateSurpriseTripInput {
  characterAnalysis: string;
  onboardingAnswers: Record<string, unknown>;
  request: SurpriseTripRequestData;
}

export type TimeOfDay = 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT';

export type ActivityCategory =
  | 'ACCOMMODATION'
  | 'SIGHTSEEING'
  | 'FOOD'
  | 'ACTIVITY'
  | 'TRANSPORT'
  | 'RELAXATION'
  | 'SHOPPING'
  | 'NIGHTLIFE';

export interface TimelineItem {
  timeOfDay: TimeOfDay;
  startTime: string;
  endTime: string;
  title: string;
  description: string;
  category: ActivityCategory;
  location: string;
  estimatedCost: number;
}

export interface DayPlan {
  dayNumber: number;
  date: string;
  theme: string;
  timeline: TimelineItem[];
}

export interface StopPlan {
  stopNumber: number;
  cityName: string;
  countryName: string;
  arrivalDate: string;
  departureDate: string;
  weatherForecastHint: string;
  localTips: string[];
  packingList: string[];
  days: DayPlan[];
}

export interface DestinationReveal {
  countryName: string;
  cityName: string;
  teaserTitle: string;
  whyThisPlace: string;
}

export interface RecommendedHotel {
  id: string;
  name: string;
  rating: number;
  pricePerNight: number;
  currency: string;
  imageUrl: string;
}

export interface BudgetBreakdown {
  accommodation: number;
  food: number;
  activities: number;
  transport: number;
  buffer: number;
  currency: string;
}

export interface TripWarning {
  type: string;
  message: string;
}

export interface SurpriseTripResult {
  destinationReveal: DestinationReveal;
  tripTitle: string;
  tripSummary: string;
  matchScore: number;
  personalizedInsights: string[];
  totalEstimatedCost: Money;
  budgetBreakdown: BudgetBreakdown;
  recommendedHotels: RecommendedHotel[];
  stops: StopPlan[];
  warnings: TripWarning[];
}
