import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject } from 'class-validator';

export class SaveOnboardingDto {
  @ApiProperty({ example: { goal: 'weight-loss', experience: 'beginner' } })
  @IsObject()
  @IsNotEmpty()
  answers: Record<string, unknown>;
}
