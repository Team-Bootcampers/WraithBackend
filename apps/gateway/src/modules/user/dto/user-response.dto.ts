import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firebaseUid: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false })
  displayName?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  isOnboarded: boolean;

  @ApiProperty()
  createdAt: string;
}
