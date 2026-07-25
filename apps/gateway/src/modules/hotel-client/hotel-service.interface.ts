import { Observable } from 'rxjs';

export interface GetHotelByIdRequest {
  id: string;
}

export interface ListHotelsRequest {
  country?: string;
  city?: string;
}

export interface HotelPrice {
  amount: number;
  currency: string;
  period: string;
}

export interface HotelResponse {
  id: string;
  name: string;
  rating: number;
  address: string;
  price: HotelPrice;
  images: string[];
  country: string;
  cityName: string;
}

export interface ListHotelsResponse {
  hotels: HotelResponse[];
  total: number;
}

export interface HotelServiceGrpcClient {
  listHotels(data: ListHotelsRequest): Observable<ListHotelsResponse>;
  getHotelById(data: GetHotelByIdRequest): Observable<HotelResponse>;
}
