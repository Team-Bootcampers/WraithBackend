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

export class TripMoneyDto {
  @ApiProperty({ example: 3200 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ example: 'TL' })
  @IsString()
  @IsNotEmpty()
  currency: string;
}

export class TripPriceDto {
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

export class TripHotelSnapshotDto {
  @ApiProperty() @IsString() @IsNotEmpty() id: string;
  @ApiProperty() @IsString() @IsNotEmpty() name: string;
  @ApiProperty() @IsNumber() rating: number;
  @ApiProperty() @IsString() @IsNotEmpty() address: string;
  @ApiProperty({ type: TripPriceDto }) @ValidateNested() @Type(() => TripPriceDto) price: TripPriceDto;
  @ApiProperty({ type: [String] }) @IsArray() @IsString({ each: true }) images: string[];
  @ApiProperty() @IsString() @IsNotEmpty() country: string;
  @ApiProperty() @IsString() @IsNotEmpty() cityName: string;
}

export class TripAttractionSnapshotDto {
  @ApiProperty() @IsString() @IsNotEmpty() id: string;
  @ApiProperty() @IsString() @IsNotEmpty() name: string;
  @ApiProperty() @IsNumber() rating: number;
  @ApiProperty() @IsString() @IsNotEmpty() address: string;
  @ApiProperty({ type: TripPriceDto }) @ValidateNested() @Type(() => TripPriceDto) price: TripPriceDto;
  @ApiProperty({ type: [String] }) @IsArray() @IsString({ each: true }) images: string[];
  @ApiProperty() @IsString() @IsNotEmpty() country: string;
  @ApiProperty() @IsString() @IsNotEmpty() cityName: string;
}

export class TripRestaurantSnapshotDto {
  @ApiProperty() @IsString() @IsNotEmpty() id: string;
  @ApiProperty() @IsString() @IsNotEmpty() name: string;
  @ApiProperty() @IsNumber() rating: number;
  @ApiProperty() @IsString() @IsNotEmpty() address: string;
  @ApiProperty({ type: TripPriceDto }) @ValidateNested() @Type(() => TripPriceDto) price: TripPriceDto;
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

  @ApiProperty({ type: TripMoneyDto, description: 'Durağın toplam maliyeti' })
  @ValidateNested()
  @Type(() => TripMoneyDto)
  totalCost: TripMoneyDto;

  @ApiProperty({ type: [TripHotelSnapshotDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TripHotelSnapshotDto)
  hotels: TripHotelSnapshotDto[];

  @ApiProperty({ type: [TripAttractionSnapshotDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TripAttractionSnapshotDto)
  attractions: TripAttractionSnapshotDto[];

  @ApiProperty({ type: [TripRestaurantSnapshotDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TripRestaurantSnapshotDto)
  restaurants: TripRestaurantSnapshotDto[];
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
