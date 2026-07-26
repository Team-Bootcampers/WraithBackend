import { ApiProperty } from '@nestjs/swagger';
import { TransportType } from './transport-type.enum';
import { TripHotelSnapshotDto, TripAttractionSnapshotDto, TripMoneyDto, TripRestaurantSnapshotDto } from './create-trip.dto';

export class TripStopResponseDto {
  @ApiProperty() stopNumber: number;
  @ApiProperty() country: string;
  @ApiProperty() cityName: string;
  @ApiProperty() startDate: string;
  @ApiProperty({ description: 'Dönüş tarihi belirtilmemişse boş string' }) endDate: string;
  @ApiProperty() personCount: number;
  @ApiProperty({ enum: TransportType }) transportType: TransportType;
  @ApiProperty({ type: TripMoneyDto }) totalCost: TripMoneyDto;
  @ApiProperty({ type: [TripHotelSnapshotDto] }) hotels: TripHotelSnapshotDto[];
  @ApiProperty({ type: [TripAttractionSnapshotDto] }) attractions: TripAttractionSnapshotDto[];
  @ApiProperty({ type: [TripRestaurantSnapshotDto] }) restaurants: TripRestaurantSnapshotDto[];
}

export class TripResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() userId: string;
  @ApiProperty() stopCount: number;
  @ApiProperty({ type: [TripStopResponseDto] }) stops: TripStopResponseDto[];
  @ApiProperty() isPublic: boolean;
  @ApiProperty({ description: 'Public yapılırken girilen başlık (public değilse boş string)' }) title: string;
  @ApiProperty({ description: 'Public yapılırken girilen açıklama (public değilse boş string)' }) description: string;
  @ApiProperty({ description: 'İlk durağın ilk otelinden alınan kapak görseli (yoksa boş string)' }) coverImage: string;
  @ApiProperty({ description: 'İlk durağın başlangıcından son durağın bitişine kadar toplam gün sayısı' }) durationDays: number;
  @ApiProperty({ description: 'Popülerite metriği (görüntülenme sayısı)' }) viewCount: number;
  @ApiProperty({ description: 'Oylama sonucu (1-5 arası ortalama puan)' }) ratingAverage: number;
  @ApiProperty({ description: 'Oylama sayısı' }) ratingCount: number;
  @ApiProperty() createdAt: string;
  @ApiProperty() updatedAt: string;
}
