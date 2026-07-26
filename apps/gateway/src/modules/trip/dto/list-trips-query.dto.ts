import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

const toBoolean = ({ value }: { value: unknown }) => value === true || value === 'true';

export class ListTripsQueryDto {
  @ApiPropertyOptional({ description: 'Sadece bu kullanıcıya ait seyahatleri listeler ("benim seyahatlerim")' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ description: 'true ise sadece public (paylaşılmış) seyahatler listelenir', default: false })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  isPublic?: boolean;

  @ApiPropertyOptional({ description: 'true ise sonuçlar popülerite (görüntülenme sayısı) sırasına göre döner', default: false })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  popular?: boolean;

  @ApiPropertyOptional({
    description:
      'true ise userId ve personalityAnalysis kullanılarak public seyahatler arasından ai-service ile kişiye özel sıralanmış öneri listesi döner',
    default: false,
  })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  personalized?: boolean;

  @ApiPropertyOptional({ description: 'personalized=true iken zorunlu: kullanıcının seyahat kişiliği analiz metni' })
  @IsOptional()
  @IsString()
  personalityAnalysis?: string;

  @ApiPropertyOptional({ description: 'Herhangi bir durağı bu ülke ile eşleşen seyahatleri filtreler' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ description: 'Herhangi bir durağı bu şehir ile eşleşen seyahatleri filtreler' })
  @IsOptional()
  @IsString()
  city?: string;
}
