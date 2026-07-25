import { ApiProperty } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firebaseUid: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false })
  displayName?: string;

  @ApiProperty()
  createdAt: string;
}

export class SignUpResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty({ type: UserProfileDto })
  user: UserProfileDto;
}

export class LoginResponseDto {
  @ApiProperty()
  idToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  expiresIn: string;

  @ApiProperty({ type: UserProfileDto, required: false })
  user?: UserProfileDto;
}
