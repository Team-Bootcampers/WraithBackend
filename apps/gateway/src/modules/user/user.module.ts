import { Module } from '@nestjs/common';
import { UserClientModule } from '../user-client/user-client.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [UserClientModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
