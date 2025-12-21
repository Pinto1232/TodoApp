import { Router, Request, Response } from 'express';
import { GetWeatherUseCase } from '../../application';
import { OpenWeatherMapService } from '../../infrastructure/external';

/**
 * Weather Routes
 * 
 * Presentation layer - HTTP routes for Weather API.
 * 
 * Follows: Single Responsibility Principle (SRP)
 */
const router = Router();

// Initialize service and use case
const weatherService = new OpenWeatherMapService();
const getWeatherUseCase = new GetWeatherUseCase(weatherService);

// South African cities
const SOUTH_AFRICAN_CITIES = [
  'Cape Town,ZA',
  'Johannesburg,ZA',
  'Durban,ZA',
  'Pretoria,ZA',
  'Port Elizabeth,ZA',
  'Bloemfontein,ZA',
  'East London,ZA',
  'Polokwane,ZA',
  'Nelspruit,ZA',
  'Kimberley,ZA',
];

/**
 * GET /api/weather
 * Get current weather for a location
 * Query params: city (optional, defaults to Kaduna)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { city } = req.query;
    
    const weather = await getWeatherUseCase.execute({
      city: city as string | undefined,
    });

    res.status(200).json({
      success: true,
      data: weather,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch weather';
    res.status(500).json({
      success: false,
      error: message,
    });
  }
});

/**
 * GET /api/weather/south-africa
 * Get current weather for all major South African cities
 */
router.get('/south-africa', async (_req: Request, res: Response) => {
  try {
    const weatherPromises = SOUTH_AFRICAN_CITIES.map((city) =>
      getWeatherUseCase.execute({ city })
    );

    const weatherData = await Promise.all(weatherPromises);

    res.status(200).json({
      success: true,
      data: weatherData,
      count: weatherData.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch weather';
    res.status(500).json({
      success: false,
      error: message,
    });
  }
});

/**
 * GET /api/weather/multi
 * Get weather for multiple cities
 * Query params: cities (comma-separated list)
 */
router.get('/multi', async (req: Request, res: Response) => {
  try {
    const { cities } = req.query;

    if (!cities || typeof cities !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Cities parameter is required (comma-separated list)',
      });
    }

    const cityList = cities.split(',').map((c) => c.trim());
    const weatherPromises = cityList.map((city) =>
      getWeatherUseCase.execute({ city })
    );

    const weatherData = await Promise.all(weatherPromises);

    res.status(200).json({
      success: true,
      data: weatherData,
      count: weatherData.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch weather';
    res.status(500).json({
      success: false,
      error: message,
    });
  }
});

export const weatherRoutes = router;
