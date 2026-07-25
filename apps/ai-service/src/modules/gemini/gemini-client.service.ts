import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

interface GeminiGenerateContentResponse {
  candidates?: {
    content?: {
      parts?: { text?: string }[];
    };
  }[];
}

@Injectable()
export class GeminiClientService {
  private readonly logger = new Logger(GeminiClientService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async generateContent(prompt: string, generationConfig?: Record<string, unknown>): Promise<string> {
    const model = this.configService.get<string>('GEMINI_MODEL') ?? 'gemini-flash-latest';
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    try {
      const response = await firstValueFrom(
        this.httpService.post<GeminiGenerateContentResponse>(
          url,
          { contents: [{ parts: [{ text: prompt }] }], ...(generationConfig ? { generationConfig } : {}) },
          { headers: { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' } },
        ),
      );

      const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new InternalServerErrorException('Gemini boş yanıt döndü');
      }
      return text.trim();
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(`Gemini isteği başarısız: ${error.response?.status} ${JSON.stringify(error.response?.data)}`);
      }
      throw new InternalServerErrorException('Gemini isteği başarısız oldu');
    }
  }
}
