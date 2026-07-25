import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { readFileSync } from 'fs';
import { join } from 'path';
import { RestaurantEntity } from './entities/restaurant.entity';

interface SeedRestaurant {
  id: string;
  name: string;
  rating: number;
  address: string;
  price: { amount: number; currency: string; period: string };
  images: string[];
}

interface SeedCity {
  city_name: string;
  restaurants: SeedRestaurant[];
}

interface SeedCountry {
  country: string;
  cities: SeedCity[];
}

@Injectable()
export class RestaurantService implements OnModuleInit {
  private readonly logger = new Logger(RestaurantService.name);

  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,
  ) {}

  // Servis her ayağa kalktığında tabloyu kontrol eder; boşsa data/restaurants-seed.json'dan doldurur.
  async onModuleInit(): Promise<void> {
    const count = await this.restaurantRepository.count();
    if (count > 0) {
      return;
    }

    const seedPath = join(process.cwd(), 'dist/apps/restaurant-service/data/restaurants-seed.json');
    const fallbackPath = join(__dirname, '../../data/restaurants-seed.json');
    let raw: string;
    try {
      raw = readFileSync(seedPath, 'utf-8');
    } catch {
      raw = readFileSync(fallbackPath, 'utf-8');
    }

    const countries = JSON.parse(raw) as SeedCountry[];
    const restaurants: RestaurantEntity[] = [];
    for (const country of countries) {
      for (const city of country.cities) {
        for (const restaurant of city.restaurants) {
          restaurants.push(
            this.restaurantRepository.create({
              id: restaurant.id,
              name: restaurant.name,
              rating: restaurant.rating,
              address: restaurant.address,
              price: restaurant.price,
              images: restaurant.images,
              country: country.country,
              cityName: city.city_name,
            }),
          );
        }
      }
    }

    await this.restaurantRepository.save(restaurants);
    this.logger.log(`Seed tamamlandı: ${restaurants.length} restoran kaydedildi.`);
  }

  async listRestaurants(country?: string, city?: string): Promise<RestaurantEntity[]> {
    const where: Partial<Record<'country' | 'cityName', string>> = {};
    if (country) where.country = country;
    if (city) where.cityName = city;

    return this.restaurantRepository.find({
      where,
      order: { country: 'ASC', cityName: 'ASC', name: 'ASC' },
    });
  }

  async getRestaurantById(id: string): Promise<RestaurantEntity> {
    const restaurant = await this.restaurantRepository.findOne({ where: { id } });
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with id ${id} not found`);
    }
    return restaurant;
  }
}
