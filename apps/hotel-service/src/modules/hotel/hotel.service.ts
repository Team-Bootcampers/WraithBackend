import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { readFileSync } from 'fs';
import { join } from 'path';
import { HotelEntity } from './entities/hotel.entity';

interface SeedHotel {
  id: string;
  name: string;
  rating: number;
  address: string;
  price: { amount: number; currency: string; period: string };
  images: string[];
}

interface SeedCity {
  city_name: string;
  hotels: SeedHotel[];
}

interface SeedCountry {
  country: string;
  cities: SeedCity[];
}

@Injectable()
export class HotelService implements OnModuleInit {
  private readonly logger = new Logger(HotelService.name);

  constructor(
    @InjectRepository(HotelEntity)
    private readonly hotelRepository: Repository<HotelEntity>,
  ) {}

  // Servis her ayağa kalktığında tabloyu kontrol eder; boşsa data/hotels-seed.json'dan doldurur.
  async onModuleInit(): Promise<void> {
    const count = await this.hotelRepository.count();
    if (count > 0) {
      return;
    }

    const seedPath = join(process.cwd(), 'dist/apps/hotel-service/data/hotels-seed.json');
    const fallbackPath = join(__dirname, '../../data/hotels-seed.json');
    let raw: string;
    try {
      raw = readFileSync(seedPath, 'utf-8');
    } catch {
      raw = readFileSync(fallbackPath, 'utf-8');
    }

    const countries = JSON.parse(raw) as SeedCountry[];
    const hotels: HotelEntity[] = [];
    for (const country of countries) {
      for (const city of country.cities) {
        for (const hotel of city.hotels) {
          hotels.push(
            this.hotelRepository.create({
              id: hotel.id,
              name: hotel.name,
              rating: hotel.rating,
              address: hotel.address,
              price: hotel.price,
              images: hotel.images,
              country: country.country,
              cityName: city.city_name,
            }),
          );
        }
      }
    }

    await this.hotelRepository.save(hotels);
    this.logger.log(`Seed tamamlandı: ${hotels.length} otel kaydedildi.`);
  }

  async listHotels(country?: string, city?: string): Promise<HotelEntity[]> {
    const where: Partial<Record<'country' | 'cityName', string>> = {};
    if (country) where.country = country;
    if (city) where.cityName = city;

    return this.hotelRepository.find({
      where,
      order: { country: 'ASC', cityName: 'ASC', name: 'ASC' },
    });
  }

  async getHotelById(id: string): Promise<HotelEntity> {
    const hotel = await this.hotelRepository.findOne({ where: { id } });
    if (!hotel) {
      throw new NotFoundException(`Hotel with id ${id} not found`);
    }
    return hotel;
  }
}
