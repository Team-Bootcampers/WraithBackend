import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTripDto } from './dto/create-trip.dto';
import { ListTripsQueryDto } from './dto/list-trips-query.dto';
import { PublishTripDto } from './dto/publish-trip.dto';
import { TripResponseDto } from './dto/trip-response.dto';
import { VoteTripDto } from './dto/vote-trip.dto';
import { TripService } from './trip.service';

@ApiTags('trips')
@Controller('trips')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post()
  @ApiOperation({ summary: 'Login olmuş bir kullanıcı için yeni bir seyahat oluşturur' })
  @ApiResponse({ status: 201, type: TripResponseDto })
  create(@Body() dto: CreateTripDto): Promise<TripResponseDto> {
    return this.tripService.createTrip(dto);
  }

  @Get()
  @ApiOperation({
    summary:
      'Seyahatleri bağımsız parametrelerle listeler: userId (benim seyahatlerim), isPublic, popular (görüntülenme sayısına göre), ' +
      'personalized (ai-service ile kişiye özel öneri) ve country/city',
  })
  @ApiResponse({ status: 200, type: [TripResponseDto] })
  list(@Query() query: ListTripsQueryDto): Promise<TripResponseDto[]> {
    return this.tripService.listTrips(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Seyahati id ile bulur (her çağrı popülerite sayacını bir artırır)' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: TripResponseDto })
  getById(@Param('id') id: string): Promise<TripResponseDto> {
    return this.tripService.getTripById(id);
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Seyahati başlık ve açıklama vererek herkese açık (isPublic=true) yapar' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 201, type: TripResponseDto })
  publish(@Param('id') id: string, @Body() dto: PublishTripDto): Promise<TripResponseDto> {
    return this.tripService.publishTrip(id, dto);
  }

  @Post(':id/vote')
  @ApiOperation({ summary: 'Seyahate 1-5 arası puan verir (aynı kullanıcı tekrar oy verirse güncellenir)' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 201, type: TripResponseDto })
  vote(@Param('id') id: string, @Body() dto: VoteTripDto): Promise<TripResponseDto> {
    return this.tripService.voteTrip(id, dto);
  }
}
