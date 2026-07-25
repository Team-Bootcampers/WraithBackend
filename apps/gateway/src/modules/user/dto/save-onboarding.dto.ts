import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsObject, ValidateNested } from 'class-validator';
import {
  AccommodationPreference,
  BudgetPriority,
  ExplorationApproach,
  FoodCulture,
  IdealVacationSummary,
  PlanningStyle,
  StressTolerance,
  TransportPreference,
  TravelMotivation,
  TravelPace,
} from './onboarding-answers.enum';

export class OnboardingAnswersDto {
  @ApiProperty({ enum: TravelMotivation, description: 'Soru 1: Seyahat Motivasyonu' })
  @IsEnum(TravelMotivation)
  travelMotivation: TravelMotivation;

  @ApiProperty({ enum: PlanningStyle, description: 'Soru 2: Planlama Tarzı' })
  @IsEnum(PlanningStyle)
  planningStyle: PlanningStyle;

  @ApiProperty({ enum: BudgetPriority, description: 'Soru 3: Bütçe Önceliği' })
  @IsEnum(BudgetPriority)
  budgetPriority: BudgetPriority;

  @ApiProperty({ enum: ExplorationApproach, description: 'Soru 4: Keşif Yaklaşımı' })
  @IsEnum(ExplorationApproach)
  explorationApproach: ExplorationApproach;

  @ApiProperty({ enum: AccommodationPreference, description: 'Soru 5: Konaklama Tercihi' })
  @IsEnum(AccommodationPreference)
  accommodationPreference: AccommodationPreference;

  @ApiProperty({ enum: TravelPace, description: 'Soru 6: Seyahat Temposu' })
  @IsEnum(TravelPace)
  travelPace: TravelPace;

  @ApiProperty({ enum: FoodCulture, description: 'Soru 7: Yemek Kültürü' })
  @IsEnum(FoodCulture)
  foodCulture: FoodCulture;

  @ApiProperty({ enum: TransportPreference, description: 'Soru 8: Sosyal Tercih ve Ulaşım' })
  @IsEnum(TransportPreference)
  transportPreference: TransportPreference;

  @ApiProperty({ enum: StressTolerance, description: 'Soru 9: Beklenmedik Durumlara Tepki' })
  @IsEnum(StressTolerance)
  stressTolerance: StressTolerance;

  @ApiProperty({ enum: IdealVacationSummary, description: 'Soru 10: İdeal Tatilin Özeti' })
  @IsEnum(IdealVacationSummary)
  idealVacationSummary: IdealVacationSummary;
}

export class SaveOnboardingDto {
  @ApiProperty({ type: OnboardingAnswersDto })
  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => OnboardingAnswersDto)
  answers: OnboardingAnswersDto;
}
