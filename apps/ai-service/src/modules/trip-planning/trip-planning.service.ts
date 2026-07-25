import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GeminiClientService } from '../gemini/gemini-client.service';
import { TRIP_PLAN_RESPONSE_SCHEMA } from './trip-planning.schema';
import { PlanTripInput, TripPlanResult, TripStopSnapshot } from './trip-planning.types';

@Injectable()
export class TripPlanningService {
  constructor(private readonly geminiClient: GeminiClientService) {}

  async planTrip(input: PlanTripInput): Promise<TripPlanResult> {
    const prompt = this.buildPrompt(input);

    const text = await this.geminiClient.generateContent(prompt, {
      responseMimeType: 'application/json',
      responseSchema: TRIP_PLAN_RESPONSE_SCHEMA,
    });

    try {
      return JSON.parse(text) as TripPlanResult;
    } catch {
      throw new InternalServerErrorException('Gemini geçerli bir seyahat planı JSON\'u döndürmedi');
    }
  }

  /** startDate (dahil) ile endDate (hariç, check-out günü) arasındaki her günün ISO tarihi. */
  private enumerateStopDates(stop: TripStopSnapshot): string[] {
    const dates: string[] = [];
    const cursor = new Date(`${stop.startDate}T00:00:00.000Z`);
    const end = new Date(`${stop.endDate}T00:00:00.000Z`);

    while (cursor < end) {
      dates.push(cursor.toISOString().slice(0, 10));
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    return dates;
  }

  private buildPrompt(input: PlanTripInput): string {
    const { characterAnalysis, onboardingAnswers, trip } = input;

    const stopsWithDates = trip.stops.map((stop) => ({
      ...stop,
      expectedDates: this.enumerateStopDates(stop),
    }));

    return [
      'Sen uzman bir seyahat planlayıcısısın. Görevin, verilen kullanıcı karakter analizi, onboarding tercihleri ve',
      'seçilmiş durak/otel/mekan/restoran verilerine dayanarak saat saat, gün gün detaylı bir seyahat planı üretmek.',
      '',
      'KULLANICI KARAKTER ANALİZİ:',
      characterAnalysis,
      '',
      'ONBOARDING TERCİHLERİ (JSON):',
      JSON.stringify(onboardingAnswers),
      '',
      'SEYAHAT VERİSİ (JSON, her durak için expectedDates alanı o durakta üretilmesi GEREKEN gün listesidir):',
      JSON.stringify({ travelerCount: trip.travelerCount, stops: stopsWithDates }, null, 2),
      '',
      'KURALLAR:',
      '1. Sadece verilen response şemasına uyan JSON döndür; şema dışında hiçbir alan ekleme.',
      '2. Her durak için stops[].days dizisi, o durağın "expectedDates" listesindeki her tarih için TAM OLARAK bir gün',
      '   objesi içermeli (sıra ve sayı birebir eşleşmeli). Fazla veya eksik gün üretme.',
      '3. days[].timeline içindeki her aktivite için timeOfDay ve category alanları SADECE şemada tanımlı enum',
      '   değerlerinden biri olmalı.',
      '4. Kullanıcının seçtiği oteller, mekanlar ve restoranlar (selectedHotels/selectedPlaces/selectedRestaurants)',
      '   programa mutlaka dahil edilmeli; ancak boşlukları doldurmak için ek, kişiliğe uygun öneriler de eklenebilir.',
      '5. Aktivite bulunmayan (selectedPlaces/selectedRestaurants boş olan) duraklarda dahi kişiliğe ve şehre uygun',
      '   gerçekçi öneriler üreterek günleri doldur.',
      '6. planningStyle DETAILED ise timeline boşluksuz ve saat saat; SPONTANEOUS/FLEXIBLE ise daha seyrek ve esnek olsun.',
      '7. travelPace SLOW ise günde daha az, FAST ise günde daha fazla aktivite planla.',
      '8. estimatedCost, ticketPrice/pricePerNight/entryFee/averagePricePerPerson gibi verilen fiyatlarla tutarlı olsun;',
      '   travelerCount kişi sayısını dikkate alarak toplamları hesapla.',
      '9. totalEstimatedCost ve budgetBreakdown, tüm duraklardaki konaklama/yemek/aktivite/ulaşım maliyetlerinin',
      '   toplamını gerçekçi biçimde yansıtsın; para birimi olarak duraklardaki ticketPrice/otel/restoran',
      '   para birimlerinden en sık geçeni kullan.',
      '10. matchScore, kullanıcının onboarding tercihleri ile üretilen planın örtüşme derecesini 0-100 arası tam sayı',
      '    olarak versin.',
      '11. Tüm metinler (başlık, özet, ipuçları, açıklamalar) Türkçe olsun.',
      '12. Sadece JSON döndür; markdown kod bloğu, açıklama veya selamlama ekleme.',
    ].join('\n');
  }
}
