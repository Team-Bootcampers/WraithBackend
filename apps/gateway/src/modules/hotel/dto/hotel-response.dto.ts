import { ApiProperty } from '@nestjs/swagger';

export class HotelPriceDto {
  @ApiProperty()
  amount: number;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  period: string;
}

export class HotelResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  address: string;

  @ApiProperty({ type: HotelPriceDto })
  price: HotelPriceDto;

  @ApiProperty({ type: [String] })
  images: string[];

  @ApiProperty()
  country: string;

  @ApiProperty()
  cityName: string;
}
