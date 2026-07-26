import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GeminiClientService } from '../gemini/gemini-client.service';
import { SURPRISE_TRIP_RESPONSE_SCHEMA } from './surprise-trip.schema';
import { GenerateSurpriseTripInput, SurpriseTripResult } from './surprise-trip.types';

@Injectable()
export class SurpriseTripService {
  constructor(private readonly geminiClient: GeminiClientService) {}

  async generateSurpriseTrip(input: GenerateSurpriseTripInput): Promise<SurpriseTripResult> {
    const prompt = this.buildPrompt(input);

    const text = await this.geminiClient.generateContent(prompt, {
      responseMimeType: 'application/json',
      responseSchema: SURPRISE_TRIP_RESPONSE_SCHEMA,
    });

    try {
      return JSON.parse(text) as SurpriseTripResult;
    } catch {
      throw new InternalServerErrorException('Gemini geçerli bir sürpriz seyahat planı JSON\'u döndürmedi');
    }
  }

  private buildPrompt(input: GenerateSurpriseTripInput): string {
    const { characterAnalysis, onboardingAnswers, request } = input;

    return [
      'Sen Wraith uygulaması için bir seyahat planlama asistanısın. Kullanıcının kişilik analizi,',
      'onboarding tercihleri, toplam bütçesi ve seyahat süresi verildiğinde, ona ÖNCEDEN HABERİ',
      'OLMADIĞI bir sürpriz destinasyon ve o destinasyona özel eksiksiz bir gezi planı üret.',
      '',
      'KULLANICI KARAKTER ANALİZİ:',
      characterAnalysis,
      '',
      'ONBOARDING TERCİHLERİ (JSON):',
      JSON.stringify(onboardingAnswers),
      '',
      'SEYAHAT İSTEĞİ (JSON):',
      JSON.stringify(request, null, 2),
      '',
      'Burada budget.amount, kişi başı değil tüm seyahat için toplam bütçedir. departureCountry ve',
      'departureCityName kalkış noktasıdır (uçuş/ulaşım maliyeti tahmini için kullan).',
      'surpriseScope değeri ANYWHERE | DOMESTIC | INTERNATIONAL olabilir.',
      'excludedCountryNames listesindeki ülkeler kullanıcının daha önce gitmiş olabileceği, önerilmemesi',
      'gereken ülkelerdir.',
      '',
      'KURALLAR:',
      '1. Destinasyonu SEN seç — kullanıcı hiçbir şehir/ülke belirtmedi. Seçim tamamen characterAnalysis',
      '   ve onboardingAnswers ile uyumlu olmalı (örn. RELAXATION + LUXURY_STAY kombinasyonu bir metropol',
      '   değil, sakin bir resort şehri önerisine yönlendirmeli).',
      '2. surpriseScope=DOMESTIC ise sadece departureCountry ile aynı ülkeden bir şehir seç.',
      '   surpriseScope=INTERNATIONAL ise departureCountry\'yi ASLA seçme.',
      '3. excludedCountryNames listesindeki hiçbir ülkeyi önerme.',
      '4. totalEstimatedCost.amount, budget.amount\'u AŞMAMALI (uçuş+konaklama+yemek+aktivite dahil).',
      '   Aşarsa süreyi veya aktivite kapsamını daralt, yine de bütçeyi geçme.',
      '5. destinationReveal.whyThisPlace alanında, seçimi characterAnalysis\'teki SPESİFİK ifadelere',
      '   referans vererek gerekçelendir (genel geçer cümleler kullanma).',
      '6. days/timeline: her gün en az 3, en fazla 6 zaman dilimi olacak şekilde saat saat plan üret.',
      '   category alanı şu değerlerden biri olmalı: ACCOMMODATION, SIGHTSEEING, FOOD, ACTIVITY,',
      '   TRANSPORT, RELAXATION, SHOPPING, NIGHTLIFE.',
      '7. Tüm tarihler "yyyy-MM-dd", saatler "HH:mm" (24 saat) formatında, timeOfDay MORNING | AFTERNOON',
      '   | EVENING | NIGHT değerlerinden biri olmalı. stops[].days, durationInDays kadar gün içermeli ve',
      '   startDate\'ten başlamalı.',
      '8. recommendedHotels en az 1, en fazla 3 öneri içermeli; gerçekçi puan/fiyat aralıkları kullan.',
      '9. Yanıtı YALNIZCA verilen response şemasına birebir uyacak şekilde, ekstra alan eklemeden ve',
      '   markdown/açıklama metni olmadan üret.',
      '10. Tüm metinler (title, description, tips vb.) Türkçe olmalı.',
    ].join('\n');
  }
}
