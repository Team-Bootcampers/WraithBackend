import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RestaurantResponseDto } from './dto/restaurant-response.dto';
import { ListRestaurantsQueryDto } from './dto/list-restaurants-query.dto';
import { RestaurantService } from './restaurant.service';

@ApiTags('restaurants')
@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get()
  @ApiOperation({ summary: 'Belirtilen ülke ve şehirdeki restoranlar arasından kullanıcının kişiliğine uygun olanları önerir' })
  @ApiResponse({ status: 200, type: [RestaurantResponseDto] })
  list(@Query() query: ListRestaurantsQueryDto): Promise<RestaurantResponseDto[]> {
    return this.restaurantService.listRestaurants(query.country, query.city, query.personalityAnalysis);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Restoranı id ile bulur' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: RestaurantResponseDto })
  getById(@Param('id') id: string): Promise<RestaurantResponseDto> {
    return this.restaurantService.getRestaurantById(id);
  }
}
