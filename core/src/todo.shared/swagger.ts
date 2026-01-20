import swaggerJsdoc from 'swagger-jsdoc';

/**
 * Swagger Configuration
 *
 * Configures OpenAPI 3.0 documentation for the API.
 */
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo App API',
      version: '1.0.0',
      description:
        'A RESTful API for managing todos and weather data, built with Clean Architecture principles.',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
    ],
    tags: [
      {
        name: 'Todos',
        description: 'Todo management endpoints',
      },
      {
        name: 'Weather',
        description: 'Weather data endpoints',
      },
      {
        name: 'Health',
        description: 'Health check endpoint',
      },
    ],
    components: {
      schemas: {
        Todo: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
            text: {
              type: 'string',
              description: 'Todo description',
              example: 'Buy groceries',
            },
            completed: {
              type: 'boolean',
              description: 'Completion status',
              example: false,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        CreateTodoRequest: {
          type: 'object',
          required: ['text'],
          properties: {
            text: {
              type: 'string',
              description: 'Todo description',
              example: 'Buy groceries',
            },
          },
        },
        UpdateTodoRequest: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              description: 'Todo description',
              example: 'Buy groceries and milk',
            },
            completed: {
              type: 'boolean',
              description: 'Completion status',
              example: true,
            },
          },
        },
        Weather: {
          type: 'object',
          properties: {
            location: {
              type: 'string',
              description: 'City name',
              example: 'Cape Town',
            },
            country: {
              type: 'string',
              description: 'Country code',
              example: 'ZA',
            },
            temperature: {
              type: 'number',
              description: 'Temperature in Celsius',
              example: 25,
            },
            feelsLike: {
              type: 'number',
              description: 'Feels like temperature in Celsius',
              example: 27,
            },
            humidity: {
              type: 'number',
              description: 'Humidity percentage',
              example: 65,
            },
            description: {
              type: 'string',
              description: 'Weather description',
              example: 'clear sky',
            },
            icon: {
              type: 'string',
              description: 'Weather icon code',
              example: '01d',
            },
            windSpeed: {
              type: 'number',
              description: 'Wind speed in m/s',
              example: 3.5,
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Data fetch timestamp',
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              example: 'Error message',
            },
          },
        },
      },
    },
  },
  apis: ['./src/todo.presentation/routes/*.ts', './src/app.ts'],
};

let swaggerSpec: ReturnType<typeof swaggerJsdoc> | null = null;

export const getSwaggerSpec = () => {
  if (!swaggerSpec) {
    swaggerSpec = swaggerJsdoc(options);
  }
  return swaggerSpec;
};
