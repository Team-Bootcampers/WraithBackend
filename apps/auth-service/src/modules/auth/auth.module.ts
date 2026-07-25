import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebaseModule } from '../firebase/firebase.module';
import { UserClientModule } from '../user-client/user-client.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginAuditEntity } from './entities/login-audit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LoginAuditEntity]), FirebaseModule, UserClientModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
