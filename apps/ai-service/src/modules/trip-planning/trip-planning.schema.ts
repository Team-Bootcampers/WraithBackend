/**
 * Gemini `generationConfig.responseSchema` tanımı (OpenAPI'nin desteklenen alt kümesi).
 * `TripPlanResult` (trip-planning.types.ts) ile bire bir uyumlu olmalı.
 */
export const TRIP_PLAN_RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    tripTitle: { type: 'STRING' },
    tripSummary: { type: 'STRING' },
    matchScore: { type: 'INTEGER' },
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
                        enum: ['SIGHTSEEING', 'FOOD', 'LOGISTICS', 'LEISURE', 'TRANSPORT', 'REST'],
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
  required: ['tripTitle', 'tripSummary', 'matchScore', 'personalizedInsights', 'totalEstimatedCost', 'budgetBreakdown', 'stops', 'warnings'],
} as const;
