import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HotelResponseDto } from './dto/hotel-response.dto';
import { ListHotelsQueryDto } from './dto/list-hotels-query.dto';
import { HotelService } from './hotel.service';

@ApiTags('hotels')
@Controller('hotels')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Get()
  @ApiOperation({ summary: 'Belirtilen ülke ve şehirdeki oteller arasından kullanıcının kişiliğine uygun olanları önerir' })
  @ApiResponse({ status: 200, type: [HotelResponseDto] })
  list(@Query() query: ListHotelsQueryDto): Promise<HotelResponseDto[]> {
    return this.hotelService.listHotels(query.country, query.city, query.personalityAnalysis);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Oteli id ile bulur' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: HotelResponseDto })
  getById(@Param('id') id: string): Promise<HotelResponseDto> {
    return this.hotelService.getHotelById(id);
  }
}
