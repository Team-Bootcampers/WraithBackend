import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { TransportType } from './transport-type.enum';

export class MoneyDto {
  @ApiProperty({ example: 3200 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ example: 'TL' })
  @IsString()
  @IsNotEmpty()
  currency: string;
}

export class PriceDto {
  @ApiProperty({ example: 1500 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ example: 'TL' })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ example: 'night' })
  @IsString()
  @IsNotEmpty()
  period: string;
}

export class HotelSnapshotDto {
  @ApiProperty() @IsString() @IsNotEmpty() id: string;
  @ApiProperty() @IsString() @IsNotEmpty() name: string;
  @ApiProperty() @IsNumber() rating: number;
  @ApiProperty() @IsString() @IsNotEmpty() address: string;
  @ApiProperty({ type: PriceDto }) @ValidateNested() @Type(() => PriceDto) price: PriceDto;
  @ApiProperty({ type: [String] }) @IsArray() @IsString({ each: true }) images: string[];
  @ApiProperty() @IsString() @IsNotEmpty() country: string;
  @ApiProperty() @IsString() @IsNotEmpty() cityName: string;
}

export class AttractionSnapshotDto {
  @ApiProperty() @IsString() @IsNotEmpty() id: string;
  @ApiProperty() @IsString() @IsNotEmpty() name: string;
  @ApiProperty() @IsNumber() rating: number;
  @ApiProperty() @IsString() @IsNotEmpty() address: string;
  @ApiProperty({ type: PriceDto }) @ValidateNested() @Type(() => PriceDto) price: PriceDto;
  @ApiProperty({ type: [String] }) @IsArray() @IsString({ each: true }) images: string[];
  @ApiProperty() @IsString() @IsNotEmpty() country: string;
  @ApiProperty() @IsString() @IsNotEmpty() cityName: string;
}

export class RestaurantSnapshotDto {
  @ApiProperty() @IsString() @IsNotEmpty() id: string;
  @ApiProperty() @IsString() @IsNotEmpty() name: string;
  @ApiProperty() @IsNumber() rating: number;
  @ApiProperty() @IsString() @IsNotEmpty() address: string;
  @ApiProperty({ type: PriceDto }) @ValidateNested() @Type(() => PriceDto) price: PriceDto;
  @ApiProperty({ type: [String] }) @IsArray() @IsString({ each: true }) images: string[];
  @ApiProperty() @IsString() @IsNotEmpty() country: string;
  @ApiProperty() @IsString() @IsNotEmpty() cityName: string;
}

export class TripStopDto {
  @ApiProperty({ example: 1, description: 'Durağın seyahat içindeki sırası' })
  @IsInt()
  @Min(1)
  stopNumber: number;

  @ApiProperty({ example: 'Türkiye' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ example: 'İstanbul' })
  @IsString()
  @IsNotEmpty()
  cityName: string;

  @ApiProperty({ example: '2026-08-01', description: 'Gidiş tarihi' })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({ example: '2026-08-05', description: 'Dönüş tarihi (zorunlu değil)' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ example: 2, description: 'Bu durakta seyahat eden kişi sayısı' })
  @IsInt()
  @Min(1)
  personCount: number;

  @ApiProperty({ enum: TransportType, description: 'Durağa ulaşım aracı' })
  @IsEnum(TransportType)
  transportType: TransportType;

  @ApiProperty({ type: MoneyDto, description: 'Durağın toplam maliyeti' })
  @ValidateNested()
  @Type(() => MoneyDto)
  totalCost: MoneyDto;

  @ApiProperty({ type: [HotelSnapshotDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HotelSnapshotDto)
  hotels: HotelSnapshotDto[];

  @ApiProperty({ type: [AttractionSnapshotDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttractionSnapshotDto)
  attractions: AttractionSnapshotDto[];

  @ApiProperty({ type: [RestaurantSnapshotDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RestaurantSnapshotDto)
  restaurants: RestaurantSnapshotDto[];
}

export class CreateTripDto {
  @ApiProperty({ description: 'Seyahati oluşturan (login olmuş) kullanıcının id\'si' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ type: [TripStopDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => TripStopDto)
  stops: TripStopDto[];

  @ApiPropertyOptional({ default: false, description: 'true ise seyahat herkese açık listelenir' })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
