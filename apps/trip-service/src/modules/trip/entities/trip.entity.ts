import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum TransportType {
  AIRPLANE = 'AIRPLANE',
  BUS = 'BUS',
  CAR = 'CAR',
}

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
  // Dönüş tarihi zorunlu değil; belirtilmemişse null.
  endDate: string | null;
  personCount: number;
  transportType: TransportType;
  totalCost: Money;
  hotels: HotelSnapshot[];
  attractions: AttractionSnapshot[];
  restaurants: RestaurantSnapshot[];
}

@Entity('trips')
export class TripEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'user_id' })
  userId: string;

  // stops.length ile aynı olmalı; sorgu/filtreleme kolaylığı için ayrı sütunda tutulur.
  @Column({ name: 'stop_count', type: 'int' })
  stopCount: number;

  @Column({ type: 'jsonb' })
  stops: TripStop[];

  @Index()
  @Column({ name: 'is_public', type: 'boolean', default: false })
  isPublic: boolean;

  // Popülerite metriği; GetTripById her çağrıldığında bir artırılır.
  @Column({ name: 'view_count', type: 'int', default: 0 })
  viewCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
