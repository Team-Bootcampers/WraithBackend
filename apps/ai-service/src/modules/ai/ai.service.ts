import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GeminiClientService } from '../gemini/gemini-client.service';
import { RESTAURANT_RECOMMENDATION_RESPONSE_SCHEMA } from './restaurant-recommendation.schema';

export interface RestaurantPrice {
  amount: number;
  currency: string;
  period: string;
}

export interface RestaurantCandidate {
  id: string;
  name: string;
  rating: number;
  address: string;
  price: RestaurantPrice;
  images: string[];
  country: string;
  cityName: string;
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
  constructor(private readonly geminiClient: GeminiClientService) {}

  async analyzeTravelPersonality(answers: Record<string, unknown>): Promise<string> {
    const prompt = [
      'Aşağıdaki JSON verisinde bir kullanıcının seyahat tercihleri yer almaktadır.',
      'Bu verilere dayanarak kullanıcının seyahat kişiliğini analiz et.',
      'Enerjik ve doğrudan kullanıcıya hitap eden bir dil kullan.',
      'Yanıtın kesinlikle 350 karakteri geçmesin!',
      `Veri: ${JSON.stringify(answers)}`,
    ].join(' ');

    const text = await this.geminiClient.generateContent(prompt);
    return this.sanitizeAnalysis(text);
  }

  // Gemini çıktısında bazen markdown (yıldız, çift tırnak vb.) karakterler geliyor;
  // sadece harfler, boşluk ve cümle sonu noktalama işaretleri (. , !) kalacak şekilde temizlenir.
  private sanitizeAnalysis(text: string): string {
    return text
      .replace(/[^\p{L}\s.,!]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();
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

    const text = await this.geminiClient.generateContent(prompt, { responseMimeType: 'application/json' });

    try {
      return JSON.parse(text) as TravelRouteResult;
    } catch {
      throw new InternalServerErrorException('Gemini geçerli bir JSON döndürmedi');
    }
  }

  async recommendRestaurants(
    country: string,
    city: string,
    personalityAnalysis: string,
    restaurants: RestaurantCandidate[],
  ): Promise<RestaurantCandidate[]> {
    const prompt = [
      'Sen uzman bir seyahat asistanısın. Amacın, verilen aday restoran listesi içinden kullanıcının',
      'seyahat kişiliği analizine en uygun olanları seçmektir.',
      '',
      'GİRDİLER:',
      `Ülke: ${country}`,
      `Şehir: ${city}`,
      `Kullanıcının Kişilik Analizi: ${personalityAnalysis}`,
      `Aday Restoran Listesi (JSON): ${JSON.stringify(restaurants)}`,
      '',
      'KURALLAR:',
      '1. Sadece yukarıdaki aday listede bulunan restoranlar arasından seçim yap; yeni restoran uydurma.',
      '2. Seçtiğin her restoranın id, name, rating, address, price, images, country, cityName alanlarını',
      '   aday listedeki değerleriyle BİREBİR aynı şekilde döndür; hiçbir alanı değiştirme.',
      '3. Restoranları, kullanıcının kişiliğine en uygun olandan en az uygun olana doğru sırala.',
      '4. Aday listede uygun restoran yoksa boş dizi döndür.',
      '5. Sadece response şemasına uyan JSON döndür; markdown kod bloğu, açıklama veya selamlama ekleme.',
    ].join('\n');

    const text = await this.geminiClient.generateContent(prompt, {
      responseMimeType: 'application/json',
      responseSchema: RESTAURANT_RECOMMENDATION_RESPONSE_SCHEMA,
    });

    try {
      return JSON.parse(text) as RestaurantCandidate[];
    } catch {
      throw new InternalServerErrorException('Gemini geçerli bir restoran önerisi JSON\'u döndürmedi');
    }
  }
}
