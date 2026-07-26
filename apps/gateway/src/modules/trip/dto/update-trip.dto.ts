import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { TripStopDto } from './create-trip.dto';

export class UpdateTripDto {
  @ApiProperty({ description: "İşlemi yapan (login olmuş) kullanıcının id'si; seyahatin sahibi değilse 403 döner" })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({ type: [TripStopDto], description: 'Gönderilirse seyahatin duraklarının tamamını değiştirir' })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => TripStopDto)
  stops?: TripStopDto[];

  @ApiPropertyOptional({ description: 'true ise seyahat herkese açık listelenir' })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiPropertyOptional({ description: 'Herkese açık listede görünecek seyahat başlığı' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Seyahatin açıklaması' })
  @IsOptional()
  @IsString()
  description?: string;
}
