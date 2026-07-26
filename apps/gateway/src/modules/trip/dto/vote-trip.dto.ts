import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class VoteTripDto {
  @ApiProperty({ description: 'Oyu veren (login olmuş) kullanıcının id\'si' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ minimum: 1, maximum: 5, description: '1 ile 5 arasında puan' })
  @IsInt()
  @Min(1)
  @Max(5)
  score: number;
}
