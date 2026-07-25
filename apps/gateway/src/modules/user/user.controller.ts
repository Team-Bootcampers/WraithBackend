import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Put } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OnboardingAnswersDto, SaveOnboardingDto } from './dto/save-onboarding.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Aktif kullanıcıları listeler' })
  @ApiResponse({ status: 200, type: [UserResponseDto] })
  list(): Promise<UserResponseDto[]> {
    return this.userService.listUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Kullanıcıyı id ile bulur' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  getById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.getUserById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Kullanıcı bilgilerini günceller' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto): Promise<UserResponseDto> {
    return this.userService.updateUser(id, dto.displayName);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Kullanıcıyı soft delete yapar (isActive = false)' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 204 })
  async remove(@Param('id') id: string): Promise<void> {
    await this.userService.deleteUser(id);
  }

  @Put(':id/onboarding')
  @ApiOperation({ summary: 'Kullanıcının onboarding cevaplarını kaydeder/günceller' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  saveOnboarding(@Param('id') id: string, @Body() dto: SaveOnboardingDto): Promise<UserResponseDto> {
    return this.userService.updateOnboardingAnswers(id, dto.answers);
  }

  @Get(':id/onboarding')
  @ApiOperation({ summary: 'Kullanıcının kayıtlı onboarding cevaplarını döner' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: OnboardingAnswersDto, description: 'Onboarding cevapları (yoksa null)' })
  getOnboarding(@Param('id') id: string): Promise<OnboardingAnswersDto | null> {
    return this.userService.getOnboardingAnswers(id);
  }
}
