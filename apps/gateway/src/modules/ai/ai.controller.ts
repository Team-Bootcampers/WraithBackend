import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AnalyzeTravelPersonalityDto, TravelPersonalityResponseDto } from './dto/analyze-travel-personality.dto';
import { GenerateTravelRouteDto, TravelRouteResponseDto } from './dto/generate-travel-route.dto';
import { GenerateSurpriseTripDto, SurpriseTripResponseDto } from './dto/surprise-trip.dto';
import { PlanTripDto, TripPlanResponseDto } from './dto/trip-planning.dto';
import { AiService } from './ai.service';

@ApiTags('ai')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('travel-personality')
  @ApiOperation({ summary: 'Onboarding cevaplarına göre Gemini ile seyahat kişiliği analizi üretir' })
  @ApiResponse({ status: 201, type: TravelPersonalityResponseDto })
  async analyzeTravelPersonality(@Body() dto: AnalyzeTravelPersonalityDto): Promise<TravelPersonalityResponseDto> {
    const analysis = await this.aiService.analyzeTravelPersonality(dto.answers);
    return { analysis };
  }

  @Post('travel-route')
  @ApiOperation({ summary: 'Ülke, şehir ve kişilik özelliklerine göre Gemini ile kişiselleştirilmiş seyahat rotası üretir' })
  @ApiResponse({ status: 201, type: TravelRouteResponseDto })
  async generateTravelRoute(@Body() dto: GenerateTravelRouteDto): Promise<TravelRouteResponseDto> {
    return this.aiService.generateTravelRoute(dto.country, dto.city, dto.personality);
  }

  @Post('trip-planning')
  @ApiOperation({ summary: 'Karakter analizi ve seçilmiş durak/otel/mekan/restoran verilerine göre Gemini ile gün gün, saat saat seyahat planı üretir' })
  @ApiResponse({ status: 201, type: TripPlanResponseDto })
  async planTrip(@Body() dto: PlanTripDto): Promise<TripPlanResponseDto> {
    return this.aiService.planTrip(dto);
  }

  @Post('surprise-trip')
  @ApiOperation({
    summary:
      'Kullanıcı hiçbir destinasyon seçmeden; karakter analizi, onboarding tercihleri, bütçe ve süreye göre Gemini ile sürpriz bir destinasyon ve eksiksiz bir seyahat planı üretir',
  })
  @ApiResponse({ status: 201, type: SurpriseTripResponseDto })
  async generateSurpriseTrip(@Body() dto: GenerateSurpriseTripDto): Promise<SurpriseTripResponseDto> {
    return this.aiService.generateSurpriseTrip(dto);
  }
}
