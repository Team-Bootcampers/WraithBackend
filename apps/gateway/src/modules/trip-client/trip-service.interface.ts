import { Observable } from 'rxjs';
import { TransportType } from '../trip/dto/transport-type.enum';

export { TransportType };

export interface Money {
  amount: number;
  currency: string;
}

export interface Price {
  amount: number;
  currency: string;
  period: string;
}

export interface HotelSnapshot {
  id: string;
  name: string;
  rating: number;
  address: string;
  price: Price;
  images: string[];
  country: string;
  cityName: string;
}

export interface AttractionSnapshot {
  id: string;
  name: string;
  rating: number;
  address: string;
  price: Price;
  images: string[];
  country: string;
  cityName: string;
}

export interface RestaurantSnapshot {
  id: string;
  name: string;
  rating: number;
  address: string;
  price: Price;
  images: string[];
  country: string;
  cityName: string;
}

export interface TripStop {
  stopNumber: number;
  country: string;
  cityName: string;
  startDate: string;
  // Dönüş tarihi zorunlu değil; belirtilmemişse boş string.
  endDate: string;
  personCount: number;
  transportType: TransportType;
  totalCost: Money;
  hotels: HotelSnapshot[];
  attractions: AttractionSnapshot[];
  restaurants: RestaurantSnapshot[];
}

export interface CreateTripRequest {
  userId: string;
  stops: TripStop[];
  isPublic: boolean;
}

export interface GetTripByIdRequest {
  id: string;
}

export interface ListTripsRequest {
  userId?: string;
  onlyPublic?: boolean;
  sortByPopularity?: boolean;
  country?: string;
  cityName?: string;
}

export interface TripResponse {
  id: string;
  userId: string;
  stopCount: number;
  stops: TripStop[];
  isPublic: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ListTripsResponse {
  trips: TripResponse[];
  total: number;
}

export interface TripServiceGrpcClient {
  createTrip(data: CreateTripRequest): Observable<TripResponse>;
  getTripById(data: GetTripByIdRequest): Observable<TripResponse>;
  listTrips(data: ListTripsRequest): Observable<ListTripsResponse>;
}
