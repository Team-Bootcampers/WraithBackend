import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTripDto } from './dto/create-trip.dto';
import { ListTripsQueryDto } from './dto/list-trips-query.dto';
import { TripResponseDto } from './dto/trip-response.dto';
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
}
