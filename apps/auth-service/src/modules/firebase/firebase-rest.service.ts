import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

export interface SignInWithPasswordResponse {
  idToken: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  email: string;
}

// Firebase Admin SDK parola doğrulayamaz; login için Identity Toolkit REST API'si kullanılır.
@Injectable()
export class FirebaseRestService {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {}

  async signInWithPassword(email: string, password: string): Promise<SignInWithPasswordResponse> {
    const apiKey = this.config.get<string>('FIREBASE_API_KEY');
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

    try {
      const { data } = await firstValueFrom(
        this.httpService.post<SignInWithPasswordResponse>(url, {
          email,
          password,
          returnSecureToken: true,
        }),
      );
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<{ error?: { message?: string } }>;
      const message = axiosError.response?.data?.error?.message ?? 'Login failed';
      throw new UnauthorizedException(message);
    }
  }
}
