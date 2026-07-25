import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { OnboardingAnswersDto } from '../../user/dto/save-onboarding.dto';
import { ActivityCategory, TimeOfDay, TransportType } from './trip-planning.enum';

// ── Request ──────────────────────────────────────────────────────────────

export class CountryDto {
  @ApiProperty({ example: 'Italy' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'IT' })
  @IsString()
  @IsNotEmpty()
  iso2: string;
}

export class TicketPriceDto {
  @ApiProperty({ example: 3200 })
  @IsNumber()
  @Min(0)
  minPrice: number;

  @ApiProperty({ example: 'TL' })
  @IsString()
  @IsNotEmpty()
  currency: string;
}

export class HotelSnapshotDto {
  @ApiProperty() @IsString() @IsNotEmpty() id: string;
  @ApiProperty() @IsString() @IsNotEmpty() name: string;
  @ApiProperty() @IsNumber() rating: number;
  @ApiProperty() @IsNumber() @Min(0) pricePerNight: number;
  @ApiProperty() @IsString() @IsNotEmpty() currency: string;
}

export class PlaceSnapshotDto {
  @ApiProperty() @IsString() @IsNotEmpty() id: string;
  @ApiProperty() @IsString() @IsNotEmpty() name: string;
  @ApiProperty() @IsNumber() rating: number;
  @ApiProperty() @IsNumber() @Min(0) entryFee: number;
}

export class RestaurantSnapshotDto {
  @ApiProperty() @IsString() @IsNotEmpty() id: string;
  @ApiProperty() @IsString() @IsNotEmpty() name: string;
  @ApiProperty() @IsNumber() rating: number;
  @ApiProperty() @IsNumber() @Min(0) averagePricePerPerson: number;
}

export class TripStopSnapshotDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  stopNumber: number;

  @ApiProperty({ type: CountryDto })
  @IsObject()
  @ValidateNested()
  @Type(() => CountryDto)
  country: CountryDto;

  @ApiProperty({ example: 'Rome' })
  @IsString()
  @IsNotEmpty()
  cityName: string;

  @ApiProperty({ example: '2026-08-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-08-05' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ enum: TransportType })
  @IsEnum(TransportType)
  transportType: TransportType;

  @ApiProperty({ type: TicketPriceDto })
  @IsObject()
  @ValidateNested()
  @Type(() => TicketPriceDto)
  ticketPrice: TicketPriceDto;

  @ApiProperty({ type: [HotelSnapshotDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HotelSnapshotDto)
  selectedHotels: HotelSnapshotDto[];

  @ApiProperty({ type: [PlaceSnapshotDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlaceSnapshotDto)
  selectedPlaces: PlaceSnapshotDto[];

  @ApiProperty({ type: [RestaurantSnapshotDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RestaurantSnapshotDto)
  selectedRestaurants: RestaurantSnapshotDto[];
}

export class TripDto {
  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  travelerCount: number;

  @ApiProperty({ type: [TripStopSnapshotDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => TripStopSnapshotDto)
  stops: TripStopSnapshotDto[];
}

export class PlanTripDto {
  @ApiProperty({ description: 'Onboarding\'de üretilen seyahat kişiliği analiz metni' })
  @IsString()
  @IsNotEmpty()
  characterAnalysis: string;

  @ApiProperty({ type: OnboardingAnswersDto })
  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => OnboardingAnswersDto)
  onboardingAnswers: OnboardingAnswersDto;

  @ApiProperty({ type: TripDto })
  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => TripDto)
  trip: TripDto;
}

// ── Response ─────────────────────────────────────────────────────────────

export class TimelineItemDto {
  @ApiProperty({ enum: TimeOfDay }) timeOfDay: TimeOfDay;
  @ApiProperty() startTime: string;
  @ApiProperty() endTime: string;
  @ApiProperty() title: string;
  @ApiProperty() description: string;
  @ApiProperty({ enum: ActivityCategory }) category: ActivityCategory;
  @ApiProperty() location: string;
  @ApiProperty() estimatedCost: number;
}

export class DayPlanDto {
  @ApiProperty() dayNumber: number;
  @ApiProperty() date: string;
  @ApiProperty() theme: string;
  @ApiProperty({ type: [TimelineItemDto] }) timeline: TimelineItemDto[];
}

export class StopPlanDto {
  @ApiProperty() stopNumber: number;
  @ApiProperty() cityName: string;
  @ApiProperty() countryName: string;
  @ApiProperty() arrivalDate: string;
  @ApiProperty() departureDate: string;
  @ApiProperty() weatherForecastHint: string;
  @ApiProperty({ type: [String] }) localTips: string[];
  @ApiProperty({ type: [String] }) packingList: string[];
  @ApiProperty({ type: [DayPlanDto] }) days: DayPlanDto[];
}

export class MoneyDto {
  @ApiProperty() amount: number;
  @ApiProperty() currency: string;
}

export class BudgetBreakdownDto {
  @ApiProperty() accommodation: number;
  @ApiProperty() food: number;
  @ApiProperty() activities: number;
  @ApiProperty() transport: number;
  @ApiProperty() buffer: number;
  @ApiProperty() currency: string;
}

export class TripWarningDto {
  @ApiProperty() type: string;
  @ApiProperty() message: string;
}

export class TripPlanResponseDto {
  @ApiProperty() tripTitle: string;
  @ApiProperty() tripSummary: string;
  @ApiProperty() matchScore: number;
  @ApiProperty({ type: [String] }) personalizedInsights: string[];
  @ApiProperty({ type: MoneyDto }) totalEstimatedCost: MoneyDto;
  @ApiProperty({ type: BudgetBreakdownDto }) budgetBreakdown: BudgetBreakdownDto;
  @ApiProperty({ type: [StopPlanDto] }) stops: StopPlanDto[];
  @ApiProperty({ type: [TripWarningDto] }) warnings: TripWarningDto[];
}
