/**
 * Gemini `generationConfig.responseSchema` tanımı (OpenAPI'nin desteklenen alt kümesi).
 * Gateway'in `RestaurantResponseDto` şekliyle bire bir uyumlu olmalı.
 */
export const RESTAURANT_RECOMMENDATION_RESPONSE_SCHEMA = {
  type: 'ARRAY',
  items: {
    type: 'OBJECT',
    properties: {
      id: { type: 'STRING' },
      name: { type: 'STRING' },
      rating: { type: 'NUMBER' },
      address: { type: 'STRING' },
      price: {
        type: 'OBJECT',
        properties: {
          amount: { type: 'NUMBER' },
          currency: { type: 'STRING' },
          period: { type: 'STRING' },
        },
        required: ['amount', 'currency', 'period'],
      },
      images: { type: 'ARRAY', items: { type: 'STRING' } },
      country: { type: 'STRING' },
      cityName: { type: 'STRING' },
    },
    required: ['id', 'name', 'rating', 'address', 'price', 'images', 'country', 'cityName'],
  },
} as const;
