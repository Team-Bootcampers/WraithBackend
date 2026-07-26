import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
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
import { BudgetBreakdownDto, CountryDto, MoneyDto, TripWarningDto } from './trip-planning.dto';
import { TimeOfDay } from './trip-planning.enum';
import { SurpriseActivityCategory, SurpriseScope } from './surprise-trip.enum';

// ── Request ──────────────────────────────────────────────────────────────

export class BudgetDto {
  @ApiProperty({ example: 25000, description: 'Kişi başı değil, tüm seyahat için toplam bütçe' })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ example: 'TRY' })
  @IsString()
  @IsNotEmpty()
  currency: string;
}

export class GenerateSurpriseTripDto {
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

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  travelerCount: number;

  @ApiProperty({ example: 4 })
  @IsInt()
  @Min(1)
  durationInDays: number;

  @ApiProperty({ example: '2026-09-10' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ type: BudgetDto })
  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => BudgetDto)
  budget: BudgetDto;

  @ApiProperty({ type: CountryDto })
  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CountryDto)
  departureCountry: CountryDto;

  @ApiProperty({ example: 'İstanbul' })
  @IsString()
  @IsNotEmpty()
  departureCityName: string;

  @ApiProperty({ enum: SurpriseScope })
  @IsEnum(SurpriseScope)
  surpriseScope: SurpriseScope;

  @ApiProperty({ type: [String], example: ['Turkey'] })
  @IsArray()
  @IsString({ each: true })
  excludedCountryNames: string[];
}

// ── Response ─────────────────────────────────────────────────────────────

export class DestinationRevealDto {
  @ApiProperty() countryName: string;
  @ApiProperty() cityName: string;
  @ApiProperty() teaserTitle: string;
  @ApiProperty() whyThisPlace: string;
}

export class RecommendedHotelDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() rating: number;
  @ApiProperty() pricePerNight: number;
  @ApiProperty() currency: string;
  @ApiProperty() imageUrl: string;
}

export class SurpriseTimelineItemDto {
  @ApiProperty({ enum: TimeOfDay }) timeOfDay: TimeOfDay;
  @ApiProperty() startTime: string;
  @ApiProperty() endTime: string;
  @ApiProperty() title: string;
  @ApiProperty() description: string;
  @ApiProperty({ enum: SurpriseActivityCategory }) category: SurpriseActivityCategory;
  @ApiProperty() location: string;
  @ApiProperty() estimatedCost: number;
}

export class SurpriseDayPlanDto {
  @ApiProperty() dayNumber: number;
  @ApiProperty() date: string;
  @ApiProperty() theme: string;
  @ApiProperty({ type: [SurpriseTimelineItemDto] }) timeline: SurpriseTimelineItemDto[];
}

export class SurpriseStopPlanDto {
  @ApiProperty() stopNumber: number;
  @ApiProperty() cityName: string;
  @ApiProperty() countryName: string;
  @ApiProperty() arrivalDate: string;
  @ApiProperty() departureDate: string;
  @ApiProperty() weatherForecastHint: string;
  @ApiProperty({ type: [String] }) localTips: string[];
  @ApiProperty({ type: [String] }) packingList: string[];
  @ApiProperty({ type: [SurpriseDayPlanDto] }) days: SurpriseDayPlanDto[];
}

export class SurpriseTripResponseDto {
  @ApiProperty({ type: DestinationRevealDto }) destinationReveal: DestinationRevealDto;
  @ApiProperty() tripTitle: string;
  @ApiProperty() tripSummary: string;
  @ApiProperty() matchScore: number;
  @ApiProperty({ type: [String] }) personalizedInsights: string[];
  @ApiProperty({ type: MoneyDto }) totalEstimatedCost: MoneyDto;
  @ApiProperty({ type: BudgetBreakdownDto }) budgetBreakdown: BudgetBreakdownDto;
  @ApiProperty({ type: [RecommendedHotelDto] }) recommendedHotels: RecommendedHotelDto[];
  @ApiProperty({ type: [SurpriseStopPlanDto] }) stops: SurpriseStopPlanDto[];
  @ApiProperty({ type: [TripWarningDto] }) warnings: TripWarningDto[];
}
