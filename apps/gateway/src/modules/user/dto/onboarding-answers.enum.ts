/** Soru 1: Seyahat Motivasyonu */
export enum TravelMotivation {
  RELAXATION = 'RELAXATION', // A - Dinlenmek
  CULTURE = 'CULTURE', // B - Kültür, müze, tarihi yerler
  ADVENTURE = 'ADVENTURE', // C - Adrenalin, doğa, macera
  FOOD_NIGHTLIFE = 'FOOD_NIGHTLIFE', // D - Yemek, eğlence, gece hayatı
}

/** Soru 2: Planlama Tarzı */
export enum PlanningStyle {
  SPONTANEOUS = 'SPONTANEOUS', // A - Doğaçlama
  FLEXIBLE = 'FLEXIBLE', // B - Ana yerler belirli, esnek program
  DETAILED = 'DETAILED', // C - Saat saat plan
}

/** Soru 3: Bütçe Önceliği */
export enum BudgetPriority {
  LUXURY_STAY = 'LUXURY_STAY', // A - Konforlu/lüks konaklama
  FINE_DINING = 'FINE_DINING', // B - Restoranlar/yerel lezzetler
  ACTIVITIES = 'ACTIVITIES', // C - Müze, tur, aktivite
  SHOPPING = 'SHOPPING', // D - Alışveriş
}

/** Soru 4: Keşif Yaklaşımı */
export enum ExplorationApproach {
  ICONIC = 'ICONIC', // A - Herkesin bildiği ikonik yapılar
  HIDDEN_GEMS = 'HIDDEN_GEMS', // B - Gizli kalmış yerel mekanlar
}

/** Soru 5: Konaklama Tercihi */
export enum AccommodationPreference {
  RESORT = 'RESORT', // A - Her şey dahil resort
  BOUTIQUE_HOTEL = 'BOUTIQUE_HOTEL', // B - Şehir merkezinde butik otel
  AIRBNB = 'AIRBNB', // C - Airbnb/Ev
  CAMPING_GLAMPING = 'CAMPING_GLAMPING', // D - Kamp/karavan/glamping
}

/** Soru 6: Seyahat Temposu */
export enum TravelPace {
  FAST = 'FAST', // A - Günde 4-5 lokasyon
  SLOW = 'SLOW', // B - Yavaş, izleyerek gezme
  NIGHT_OWL = 'NIGHT_OWL', // C - Gündüz dinlenip gece dışarı çıkma
}

/** Soru 7: Yemek Kültürü */
export enum FoodCulture {
  FOODIE = 'FOODIE', // A - Her şeyi denerim
  SAFE_FAMILIAR = 'SAFE_FAMILIAR', // B - Bildiğim güvenli lezzetler
  HEALTHY_DIET = 'HEALTHY_DIET', // C - Sağlıklı/vegan/diyet uyumlu
}

/** Soru 8: Sosyal Tercih ve Ulaşım */
export enum TransportPreference {
  PUBLIC_TRANSPORT = 'PUBLIC_TRANSPORT', // A - Toplu taşıma/yürüyüş
  PRIVATE_CAR = 'PRIVATE_CAR', // B - Araç kiralama/taksi/Uber
  GUIDED_TOURS = 'GUIDED_TOURS', // C - Rehberli grup turları
}

/** Soru 9: Beklenmedik Durumlara Tepki */
export enum StressTolerance {
  NEEDS_BACKUP_PLAN = 'NEEDS_BACKUP_PLAN', // A - Stres olur, alternatif plan ister
  GOES_WITH_FLOW = 'GOES_WITH_FLOW', // B - Fırsat bilir, keşfe çıkar
}

/** Soru 10: İdeal Tatilin Özeti */
export enum IdealVacationSummary {
  PEACE = 'PEACE', // A - Huzur
  EXCITEMENT = 'EXCITEMENT', // B - Heyecan
  LUXURY = 'LUXURY', // C - Lüks
  CULTURE = 'CULTURE', // D - Kültür
}
