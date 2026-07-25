import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { FirebaseAdminService } from './firebase-admin.service';
import { FirebaseRestService } from './firebase-rest.service';

@Module({
  imports: [HttpModule],
  providers: [FirebaseAdminService, FirebaseRestService],
  exports: [FirebaseAdminService, FirebaseRestService],
})
export class FirebaseModule {}
