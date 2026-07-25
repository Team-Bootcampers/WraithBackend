import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';

export interface HotelPrice {
  amount: number;
  currency: string;
  period: string;
}

@Entity('hotels')
export class HotelEntity {
  // Kaynak JSON'daki id'ler (ör. "tr-ist-01") anlamlı ve stabil; UUID üretmek yerine olduğu gibi kullanılır.
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ type: 'float' })
  rating: number;

  @Column()
  address: string;

  @Column({ type: 'jsonb' })
  price: HotelPrice;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  images: string[];

  @Index()
  @Column()
  country: string;

  @Index()
  @Column({ name: 'city_name' })
  cityName: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
