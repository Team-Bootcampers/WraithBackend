export type TransportType = 'AIRPLANE' | 'BUS' | 'TRAIN' | 'CAR' | 'FERRY';

export interface Country {
  name: string;
  iso2: string;
}

export interface TicketPrice {
  minPrice: number;
  currency: string;
}

export interface HotelSnapshot {
  id: string;
  name: string;
  rating: number;
  pricePerNight: number;
  currency: string;
}

export interface PlaceSnapshot {
  id: string;
  name: string;
  rating: number;
  entryFee: number;
}

export interface RestaurantSnapshot {
  id: string;
  name: string;
  rating: number;
  averagePricePerPerson: number;
}

export interface TripStopSnapshot {
  stopNumber: number;
  country: Country;
  cityName: string;
  startDate: string;
  endDate: string;
  transportType: TransportType;
  ticketPrice: TicketPrice;
  selectedHotels: HotelSnapshot[];
  selectedPlaces: PlaceSnapshot[];
  selectedRestaurants: RestaurantSnapshot[];
}

export interface TripSnapshot {
  travelerCount: number;
  stops: TripStopSnapshot[];
}

export interface PlanTripInput {
  characterAnalysis: string;
  onboardingAnswers: Record<string, unknown>;
  trip: TripSnapshot;
}

export type TimeOfDay = 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT';

export type ActivityCategory = 'SIGHTSEEING' | 'FOOD' | 'LOGISTICS' | 'LEISURE' | 'TRANSPORT' | 'REST';

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

export interface Money {
  amount: number;
  currency: string;
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

export interface TripPlanResult {
  tripTitle: string;
  tripSummary: string;
  matchScore: number;
  personalizedInsights: string[];
  totalEstimatedCost: Money;
  budgetBreakdown: BudgetBreakdown;
  stops: StopPlan[];
  warnings: TripWarning[];
}
