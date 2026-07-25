import { Observable } from 'rxjs';

export interface GetAttractionByIdRequest {
  id: string;
}

export interface ListAttractionsRequest {
  country?: string;
  city?: string;
}

export interface AttractionPrice {
  amount: number;
  currency: string;
  period: string;
}

export interface AttractionResponse {
  id: string;
  name: string;
  rating: number;
  address: string;
  price: AttractionPrice;
  images: string[];
  country: string;
  cityName: string;
}

export interface ListAttractionsResponse {
  attractions: AttractionResponse[];
  total: number;
}

export interface AttractionServiceGrpcClient {
  listAttractions(data: ListAttractionsRequest): Observable<ListAttractionsResponse>;
  getAttractionById(data: GetAttractionByIdRequest): Observable<AttractionResponse>;
}
