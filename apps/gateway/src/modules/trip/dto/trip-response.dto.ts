import { ApiProperty } from '@nestjs/swagger';
import { TransportType } from './transport-type.enum';
import { HotelSnapshotDto, AttractionSnapshotDto, MoneyDto, RestaurantSnapshotDto } from './create-trip.dto';

export class TripStopResponseDto {
  @ApiProperty() stopNumber: number;
  @ApiProperty() country: string;
  @ApiProperty() cityName: string;
  @ApiProperty() startDate: string;
  @ApiProperty({ description: 'Dönüş tarihi belirtilmemişse boş string' }) endDate: string;
  @ApiProperty() personCount: number;
  @ApiProperty({ enum: TransportType }) transportType: TransportType;
  @ApiProperty({ type: MoneyDto }) totalCost: MoneyDto;
  @ApiProperty({ type: [HotelSnapshotDto] }) hotels: HotelSnapshotDto[];
  @ApiProperty({ type: [AttractionSnapshotDto] }) attractions: AttractionSnapshotDto[];
  @ApiProperty({ type: [RestaurantSnapshotDto] }) restaurants: RestaurantSnapshotDto[];
}

export class TripResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() userId: string;
  @ApiProperty() stopCount: number;
  @ApiProperty({ type: [TripStopResponseDto] }) stops: TripStopResponseDto[];
  @ApiProperty() isPublic: boolean;
  @ApiProperty({ description: 'Popülerite metriği (görüntülenme sayısı)' }) viewCount: number;
  @ApiProperty() createdAt: string;
  @ApiProperty() updatedAt: string;
}
