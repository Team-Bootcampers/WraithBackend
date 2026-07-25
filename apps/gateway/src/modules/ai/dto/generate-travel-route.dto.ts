import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsObject, IsString, ValidateNested } from 'class-validator';
import { OnboardingAnswersDto } from '../../user/dto/save-onboarding.dto';

export class GenerateTravelRouteDto {
  @ApiProperty({ description: 'Rota oluşturulacak ülke', example: 'Türkiye' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ description: 'Rota oluşturulacak şehir', example: 'İstanbul' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ type: OnboardingAnswersDto, description: 'Kullanıcının kişisel/seyahat özellikleri' })
  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => OnboardingAnswersDto)
  personality: OnboardingAnswersDto;
}

export class TravelRoutePlaceDto {
  @ApiProperty() isim: string;
  @ApiProperty() resim: string;
  @ApiProperty() aciklama: string;
  @ApiProperty() puan: number;
}

export class TravelRouteRestaurantDto {
  @ApiProperty() isim: string;
  @ApiProperty() resim: string;
  @ApiProperty() puan: number;
  @ApiProperty() tur: string;
}

export class TravelRouteResponseDto {
  @ApiProperty({ type: [TravelRoutePlaceDto] })
  gezilecek_yerler: TravelRoutePlaceDto[];

  @ApiProperty({ type: [TravelRouteRestaurantDto] })
  restoranlar: TravelRouteRestaurantDto[];
}
