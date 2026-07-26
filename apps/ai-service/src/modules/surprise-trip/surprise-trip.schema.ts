/**
 * Gemini `generationConfig.responseSchema` tanımı (OpenAPI'nin desteklenen alt kümesi).
 * `SurpriseTripResult` (surprise-trip.types.ts) ile bire bir uyumlu olmalı.
 */
export const SURPRISE_TRIP_RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    destinationReveal: {
      type: 'OBJECT',
      properties: {
        countryName: { type: 'STRING' },
        cityName: { type: 'STRING' },
        teaserTitle: { type: 'STRING' },
        whyThisPlace: { type: 'STRING' },
      },
      required: ['countryName', 'cityName', 'teaserTitle', 'whyThisPlace'],
    },
    tripTitle: { type: 'STRING' },
    tripSummary: { type: 'STRING' },
    matchScore: { type: 'NUMBER' },
    personalizedInsights: { type: 'ARRAY', items: { type: 'STRING' } },
    totalEstimatedCost: {
      type: 'OBJECT',
      properties: {
        amount: { type: 'NUMBER' },
        currency: { type: 'STRING' },
      },
      required: ['amount', 'currency'],
    },
    budgetBreakdown: {
      type: 'OBJECT',
      properties: {
        accommodation: { type: 'NUMBER' },
        food: { type: 'NUMBER' },
        activities: { type: 'NUMBER' },
        transport: { type: 'NUMBER' },
        buffer: { type: 'NUMBER' },
        currency: { type: 'STRING' },
      },
      required: ['accommodation', 'food', 'activities', 'transport', 'buffer', 'currency'],
    },
    recommendedHotels: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          id: { type: 'STRING' },
          name: { type: 'STRING' },
          rating: { type: 'NUMBER' },
          pricePerNight: { type: 'NUMBER' },
          currency: { type: 'STRING' },
          imageUrl: { type: 'STRING' },
        },
        required: ['id', 'name', 'rating', 'pricePerNight', 'currency', 'imageUrl'],
      },
    },
    stops: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          stopNumber: { type: 'INTEGER' },
          cityName: { type: 'STRING' },
          countryName: { type: 'STRING' },
          arrivalDate: { type: 'STRING' },
          departureDate: { type: 'STRING' },
          weatherForecastHint: { type: 'STRING' },
          localTips: { type: 'ARRAY', items: { type: 'STRING' } },
          packingList: { type: 'ARRAY', items: { type: 'STRING' } },
          days: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                dayNumber: { type: 'INTEGER' },
                date: { type: 'STRING' },
                theme: { type: 'STRING' },
                timeline: {
                  type: 'ARRAY',
                  items: {
                    type: 'OBJECT',
                    properties: {
                      timeOfDay: { type: 'STRING', enum: ['MORNING', 'AFTERNOON', 'EVENING', 'NIGHT'] },
                      startTime: { type: 'STRING' },
                      endTime: { type: 'STRING' },
                      title: { type: 'STRING' },
                      description: { type: 'STRING' },
                      category: {
                        type: 'STRING',
                        enum: [
                          'ACCOMMODATION',
                          'SIGHTSEEING',
                          'FOOD',
                          'ACTIVITY',
                          'TRANSPORT',
                          'RELAXATION',
                          'SHOPPING',
                          'NIGHTLIFE',
                        ],
                      },
                      location: { type: 'STRING' },
                      estimatedCost: { type: 'NUMBER' },
                    },
                    required: ['timeOfDay', 'startTime', 'endTime', 'title', 'description', 'category', 'location', 'estimatedCost'],
                  },
                },
              },
              required: ['dayNumber', 'date', 'theme', 'timeline'],
            },
          },
        },
        required: [
          'stopNumber',
          'cityName',
          'countryName',
          'arrivalDate',
          'departureDate',
          'weatherForecastHint',
          'localTips',
          'packingList',
          'days',
        ],
      },
    },
    warnings: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          type: { type: 'STRING' },
          message: { type: 'STRING' },
        },
        required: ['type', 'message'],
      },
    },
  },
  required: [
    'destinationReveal',
    'tripTitle',
    'tripSummary',
    'matchScore',
    'personalizedInsights',
    'totalEstimatedCost',
    'budgetBreakdown',
    'recommendedHotels',
    'stops',
    'warnings',
  ],
} as const;
