import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PublishTripDto {
  @ApiProperty({ description: 'Herkese açık listede görünecek seyahat başlığı' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Seyahatin açıklaması' })
  @IsString()
  @IsNotEmpty()
  description: string;
}
