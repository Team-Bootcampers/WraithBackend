import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteTripDto {
  @ApiProperty({ description: "İşlemi yapan (login olmuş) kullanıcının id'si; seyahatin sahibi değilse 403 döner" })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
