import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { readFileSync } from 'fs';
import { join } from 'path';
import { AttractionEntity } from './entities/attraction.entity';

interface SeedAttraction {
  id: string;
  name: string;
  rating: number;
  address: string;
  price: { amount: number; currency: string; period: string };
  images: string[];
}

interface SeedCity {
  city_name: string;
  attractions: SeedAttraction[];
}

interface SeedCountry {
  country: string;
  cities: SeedCity[];
}

@Injectable()
export class AttractionService implements OnModuleInit {
  private readonly logger = new Logger(AttractionService.name);

  constructor(
    @InjectRepository(AttractionEntity)
    private readonly attractionRepository: Repository<AttractionEntity>,
  ) {}

  // Servis her ayağa kalktığında tabloyu kontrol eder; boşsa data/attractions-seed.json'dan doldurur.
  async onModuleInit(): Promise<void> {
    const count = await this.attractionRepository.count();
    if (count > 0) {
      return;
    }

    const seedPath = join(process.cwd(), 'dist/apps/attraction-service/data/attractions-seed.json');
    const fallbackPath = join(__dirname, '../../data/attractions-seed.json');
    let raw: string;
    try {
      raw = readFileSync(seedPath, 'utf-8');
    } catch {
      raw = readFileSync(fallbackPath, 'utf-8');
    }

    const countries = JSON.parse(raw) as SeedCountry[];
    const attractions: AttractionEntity[] = [];
    for (const country of countries) {
      for (const city of country.cities) {
        for (const attraction of city.attractions) {
          attractions.push(
            this.attractionRepository.create({
              id: attraction.id,
              name: attraction.name,
              rating: attraction.rating,
              address: attraction.address,
              price: attraction.price,
              images: attraction.images,
              country: country.country,
              cityName: city.city_name,
            }),
          );
        }
      }
    }

    await this.attractionRepository.save(attractions);
    this.logger.log(`Seed tamamlandı: ${attractions.length} gezilecek yer kaydedildi.`);
  }

  async listAttractions(country?: string, city?: string): Promise<AttractionEntity[]> {
    const where: Partial<Record<'country' | 'cityName', string>> = {};
    if (country) where.country = country;
    if (city) where.cityName = city;

    return this.attractionRepository.find({
      where,
      order: { country: 'ASC', cityName: 'ASC', name: 'ASC' },
    });
  }

  async getAttractionById(id: string): Promise<AttractionEntity> {
    const attraction = await this.attractionRepository.findOne({ where: { id } });
    if (!attraction) {
      throw new NotFoundException(`Attraction with id ${id} not found`);
    }
    return attraction;
  }
}
