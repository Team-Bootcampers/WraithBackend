import { ApiProperty } from '@nestjs/swagger';

export class AttractionPriceDto {
  @ApiProperty()
  amount: number;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  period: string;
}

export class AttractionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  address: string;

  @ApiProperty({ type: AttractionPriceDto })
  price: AttractionPriceDto;

  @ApiProperty({ type: [String] })
  images: string[];

  @ApiProperty()
  country: string;

  @ApiProperty()
  cityName: string;
}
