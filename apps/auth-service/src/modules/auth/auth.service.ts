import { Inject, Injectable, Logger, OnModuleInit, ServiceUnavailableException } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { FirebaseAdminService } from '../firebase/firebase-admin.service';
import { FirebaseRestService } from '../firebase/firebase-rest.service';
import { USER_PACKAGE } from '../user-client/user-client.module';
import { UserServiceGrpcClient } from '../user-client/user-service.interface';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginAuditEntity } from './entities/login-audit.entity';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);
  private userClient: UserServiceGrpcClient;

  constructor(
    @Inject(USER_PACKAGE) private readonly userClientProxy: ClientGrpc,
    private readonly firebaseAdmin: FirebaseAdminService,
    private readonly firebaseRest: FirebaseRestService,
    @InjectRepository(LoginAuditEntity)
    private readonly loginAuditRepository: Repository<LoginAuditEntity>,
  ) {}

  onModuleInit() {
    this.userClient = this.userClientProxy.getService<UserServiceGrpcClient>('UserService');
  }

  async signUp(dto: SignUpDto) {
    const firebaseUser = await this.firebaseAdmin.createUser({
      email: dto.email,
      password: dto.password,
      displayName: dto.displayName,
    });

    try {
      const profile = await firstValueFrom(
        this.userClient.createUser({
          firebaseUid: firebaseUser.uid,
          email: dto.email,
          displayName: dto.displayName ?? '',
        }),
      );

      return {
        message: 'Kullanıcı başarıyla oluşturuldu',
        user: profile,
      };
    } catch (error) {
      // user-service profili oluşturamadıysa Firebase'de sahipsiz hesap kalmasın diye geri alıyoruz.
      this.logger.error(
        `user-service profile creation failed, rolling back Firebase user ${firebaseUser.uid}`,
        error as Error,
      );
      await this.firebaseAdmin.deleteUser(firebaseUser.uid).catch((rollbackError) => {
        this.logger.error(`Rollback failed for Firebase user ${firebaseUser.uid}`, rollbackError as Error);
      });
      throw new ServiceUnavailableException('Kayıt şu anda tamamlanamıyor, lütfen tekrar deneyin.');
    }
  }

  async login(dto: LoginDto) {
    let result;
    try {
      result = await this.firebaseRest.signInWithPassword(dto.email, dto.password);
    } catch (error) {
      await this.loginAuditRepository.save(
        this.loginAuditRepository.create({
          email: dto.email,
          success: false,
          failureReason: (error as Error).message,
        }),
      );
      throw error;
    }

    await this.loginAuditRepository.save(
      this.loginAuditRepository.create({
        firebaseUid: result.localId,
        email: dto.email,
        success: true,
      }),
    );

    // user-service ayakta değilse login'i başarısız saymıyoruz: kimlik doğrulama zaten Firebase üzerinden tamamlandı.
    let profile;
    try {
      profile = await firstValueFrom(this.userClient.getUserByFirebaseUid({ firebaseUid: result.localId }));
    } catch (error) {
      this.logger.warn(`user-service profile lookup failed for ${result.localId}: ${(error as Error).message}`);
    }

    return {
      idToken: result.idToken,
      refreshToken: result.refreshToken,
      expiresIn: result.expiresIn,
      user: profile,
    };
  }
}
