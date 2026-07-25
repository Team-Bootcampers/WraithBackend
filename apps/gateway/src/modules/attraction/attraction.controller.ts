import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AttractionResponseDto } from './dto/attraction-response.dto';
import { ListAttractionsQueryDto } from './dto/list-attractions-query.dto';
import { AttractionService } from './attraction.service';

@ApiTags('attractions')
@Controller('attractions')
export class AttractionController {
  constructor(private readonly attractionService: AttractionService) {}

  @Get()
  @ApiOperation({ summary: 'Belirtilen ülke ve şehirdeki gezilecek yerler arasından kullanıcının kişiliğine uygun olanları önerir' })
  @ApiResponse({ status: 200, type: [AttractionResponseDto] })
  list(@Query() query: ListAttractionsQueryDto): Promise<AttractionResponseDto[]> {
    return this.attractionService.listAttractions(query.country, query.city, query.personalityAnalysis);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Gezilecek yeri id ile bulur' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: AttractionResponseDto })
  getById(@Param('id') id: string): Promise<AttractionResponseDto> {
    return this.attractionService.getAttractionById(id);
  }
}
