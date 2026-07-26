import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ListHotelsQueryDto {
  @ApiProperty({ description: 'Ülke adı (ör. Türkiye)' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ description: 'Şehir adı (ör. İstanbul)' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: 'Kullanıcının seyahat kişiliği analiz metni (kişiye uygun otelleri belirlemek için kullanılır)' })
  @IsString()
  @IsNotEmpty()
  personalityAnalysis: string;
}
