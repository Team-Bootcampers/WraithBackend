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

export interface TravelRoutePlace {
  isim: string;
  resim: string;
  aciklama: string;
  puan: number;
}

export interface TravelRouteRestaurant {
  isim: string;
  resim: string;
  puan: number;
  tur: string;
}

export interface TravelRouteResult {
  gezilecek_yerler: TravelRoutePlace[];
  restoranlar: TravelRouteRestaurant[];
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async analyzeTravelPersonality(answers: Record<string, unknown>): Promise<string> {
    const prompt = [
      'Aşağıdaki JSON verisinde bir kullanıcının seyahat tercihleri yer almaktadır.',
      'Bu verilere dayanarak kullanıcının seyahat kişiliğini analiz et.',
      'Enerjik ve doğrudan kullanıcıya hitap eden bir dil kullan.',
      'Yanıtın kesinlikle 250 karakteri geçmesin!',
      `Veri: ${JSON.stringify(answers)}`,
    ].join(' ');

    const text = await this.callGemini(prompt);
    return text.trim();
  }

  async generateTravelRoute(
    country: string,
    city: string,
    personality: Record<string, unknown>,
  ): Promise<TravelRouteResult> {
    const prompt = [
      'Sen uzman bir seyahat asistanısın. Amacın, verilen ülke, şehir ve kişilik özellikleri verilerini analiz ederek',
      'kullanıcıya tamamen kişiselleştirilmiş gezilecek yerler ve restoran önerileri sunmaktır.',
      '',
      'GİRDİLER:',
      `Ülke: ${country}`,
      `Şehir: ${city}`,
      `Kişisel Özellikler: ${JSON.stringify(personality)}`,
      '',
      'KURALLAR:',
      '1. Sadece aşağıda belirtilen JSON formatında çıktı ver.',
      '2. JSON dışında hiçbir metin, selamlama veya markdown (```json) etiketi kullanma.',
      '3. "puan" değerleri her zaman 1.0 ile 5.0 arasında rastgele belirlenmiş ondalıklı bir sayı (float) olmalıdır (Örn: 4.2).',
      '4. "resim" alanlarına temsili (placeholder) veya varsa gerçek görsel URL\'leri ekle.',
      '5. Restoranların "tur" alanını (esnaf lokantası, fast food, fine dining vb.) kullanıcının özelliklerine',
      '   (örn. budgetPriority, foodCulture) uygun şekilde belirle.',
      '',
      'BEKLENEN JSON FORMATI:',
      JSON.stringify(
        {
          gezilecek_yerler: [{ isim: 'Yerin İsmi', resim: 'https://example.com/yer-gorseli.jpg', aciklama: '...', puan: 4.7 }],
          restoranlar: [{ isim: 'Restoran İsmi', resim: 'https://example.com/restoran-gorseli.jpg', puan: 4.3, tur: 'Esnaf Lokantası' }],
        },
        null,
        2,
      ),
    ].join('\n');

    const text = await this.callGemini(prompt, { responseMimeType: 'application/json' });

    try {
      return JSON.parse(text) as TravelRouteResult;
    } catch {
      throw new InternalServerErrorException('Gemini geçerli bir JSON döndürmedi');
    }
  }

  private async callGemini(prompt: string, generationConfig?: Record<string, unknown>): Promise<string> {
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
