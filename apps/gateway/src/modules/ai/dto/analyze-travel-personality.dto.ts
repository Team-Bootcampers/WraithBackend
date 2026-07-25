import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsObject, ValidateNested } from 'class-validator';
import { OnboardingAnswersDto } from '../../user/dto/save-onboarding.dto';

export class AnalyzeTravelPersonalityDto {
  @ApiProperty({ type: OnboardingAnswersDto })
  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => OnboardingAnswersDto)
  answers: OnboardingAnswersDto;
}

export class TravelPersonalityResponseDto {
  @ApiProperty({ description: 'Gemini tarafından üretilen seyahat kişiliği analiz paragrafı' })
  analysis: string;
}
