import { Observable } from 'rxjs';

export interface GetRestaurantByIdRequest {
  id: string;
}

export interface ListRestaurantsRequest {
  country?: string;
  city?: string;
}

export interface RestaurantPrice {
  amount: number;
  currency: string;
  period: string;
}

export interface RestaurantResponse {
  id: string;
  name: string;
  rating: number;
  address: string;
  price: RestaurantPrice;
  images: string[];
  country: string;
  cityName: string;
}

export interface ListRestaurantsResponse {
  restaurants: RestaurantResponse[];
  total: number;
}

export interface RestaurantServiceGrpcClient {
  listRestaurants(data: ListRestaurantsRequest): Observable<ListRestaurantsResponse>;
  getRestaurantById(data: GetRestaurantByIdRequest): Observable<RestaurantResponse>;
}
