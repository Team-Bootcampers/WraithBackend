import { ApiProperty } from '@nestjs/swagger';

export class RestaurantPriceDto {
  @ApiProperty()
  amount: number;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  period: string;
}

export class RestaurantResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  address: string;

  @ApiProperty({ type: RestaurantPriceDto })
  price: RestaurantPriceDto;

  @ApiProperty({ type: [String] })
  images: string[];

  @ApiProperty()
  country: string;

  @ApiProperty()
  cityName: string;
}
