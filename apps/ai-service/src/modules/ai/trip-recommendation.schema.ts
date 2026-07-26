/**
 * Gemini `generationConfig.responseSchema` tanımı (OpenAPI'nin desteklenen alt kümesi).
 * trip-service'in `TripResponse` şekliyle bire bir uyumlu olmalı.
 */
const PRICE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    amount: { type: 'NUMBER' },
    currency: { type: 'STRING' },
    period: { type: 'STRING' },
  },
  required: ['amount', 'currency', 'period'],
} as const;

const SNAPSHOT_SCHEMA = {
  type: 'OBJECT',
  properties: {
    id: { type: 'STRING' },
    name: { type: 'STRING' },
    rating: { type: 'NUMBER' },
    address: { type: 'STRING' },
    price: PRICE_SCHEMA,
    images: { type: 'ARRAY', items: { type: 'STRING' } },
    country: { type: 'STRING' },
    cityName: { type: 'STRING' },
  },
  required: ['id', 'name', 'rating', 'address', 'price', 'images', 'country', 'cityName'],
} as const;

const TRIP_STOP_SCHEMA = {
  type: 'OBJECT',
  properties: {
    stopNumber: { type: 'INTEGER' },
    country: { type: 'STRING' },
    cityName: { type: 'STRING' },
    startDate: { type: 'STRING' },
    endDate: { type: 'STRING' },
    personCount: { type: 'INTEGER' },
    transportType: { type: 'STRING', enum: ['AIRPLANE', 'BUS', 'CAR'] },
    totalCost: {
      type: 'OBJECT',
      properties: { amount: { type: 'NUMBER' }, currency: { type: 'STRING' } },
      required: ['amount', 'currency'],
    },
    hotels: { type: 'ARRAY', items: SNAPSHOT_SCHEMA },
    attractions: { type: 'ARRAY', items: SNAPSHOT_SCHEMA },
    restaurants: { type: 'ARRAY', items: SNAPSHOT_SCHEMA },
  },
  required: ['stopNumber', 'country', 'cityName', 'startDate', 'endDate', 'personCount', 'transportType', 'totalCost', 'hotels', 'attractions', 'restaurants'],
} as const;

export const TRIP_RECOMMENDATION_RESPONSE_SCHEMA = {
  type: 'ARRAY',
  items: {
    type: 'OBJECT',
    properties: {
      id: { type: 'STRING' },
      userId: { type: 'STRING' },
      stopCount: { type: 'INTEGER' },
      stops: { type: 'ARRAY', items: TRIP_STOP_SCHEMA },
      isPublic: { type: 'BOOLEAN' },
      title: { type: 'STRING' },
      description: { type: 'STRING' },
      viewCount: { type: 'INTEGER' },
      ratingAverage: { type: 'NUMBER' },
      ratingCount: { type: 'INTEGER' },
      createdAt: { type: 'STRING' },
      updatedAt: { type: 'STRING' },
    },
    required: [
      'id',
      'userId',
      'stopCount',
      'stops',
      'isPublic',
      'title',
      'description',
      'viewCount',
      'ratingAverage',
      'ratingCount',
      'createdAt',
      'updatedAt',
    ],
  },
} as const;
