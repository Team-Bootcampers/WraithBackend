import { Injectable, Logger, OnModuleInit, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAdminService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseAdminService.name);
  private app?: admin.app.App;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    if (admin.apps.length > 0) {
      this.app = admin.apps[0] as admin.app.App;
      return;
    }

    // Eksik/geçersiz FIREBASE_* env değerlerinde burada throw etmiyoruz: aksi halde
    // uygulama hiç ayağa kalkmaz ve Swagger/health bile erişilemez olur. Bunun yerine
    // servis "yapılandırılmamış" modda başlar, ilk gerçek çağrıda 503 döner.
    try {
      this.app = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: this.config.get<string>('FIREBASE_PROJECT_ID'),
          clientEmail: this.config.get<string>('FIREBASE_CLIENT_EMAIL'),
          privateKey: this.config.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n'),
        }),
      });
    } catch (error) {
      this.logger.error(
        'Firebase Admin SDK başlatılamadı — FIREBASE_PROJECT_ID/CLIENT_EMAIL/PRIVATE_KEY değerlerini .env dosyasında kontrol edin.',
        error as Error,
      );
    }
  }

  get auth(): admin.auth.Auth {
    if (!this.app) {
      throw new ServiceUnavailableException(
        'Firebase Admin SDK yapılandırılmamış. FIREBASE_PROJECT_ID/CLIENT_EMAIL/PRIVATE_KEY değerlerini .env dosyasına ekleyin.',
      );
    }
    return this.app.auth();
  }

  createUser(params: { email: string; password: string; displayName?: string }): Promise<admin.auth.UserRecord> {
    return this.auth.createUser({
      email: params.email,
      password: params.password,
      displayName: params.displayName,
    });
  }

  async deleteUser(uid: string): Promise<void> {
    await this.auth.deleteUser(uid);
  }
}
