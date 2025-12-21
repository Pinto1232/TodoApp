import { Router, Request, Response } from 'express';
import { GetWeatherUseCase } from '../../todo.application';
import { OpenWeatherMapService } from '../../todo.infrastructure/external';

/**
 * Weather Routes
 *
 * Presentation layer - HTTP routes for Weather API.
 *
 * Follows: Single Responsibility Principle (SRP)
 */
const router = Router();

const weatherService = new OpenWeatherMapService();
const getWeatherUseCase = new GetWeatherUseCase(weatherService);

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
 * @swagger
 * /api/weather:
 *   get:
 *     summary: Get current weather for a location
 *     tags: [Weather]
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: City name (defaults to Kaduna)
 *         example: Cape Town
 *     responses:
 *       200:
 *         description: Weather data for the specified city
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Weather'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 * @swagger
 * /api/weather/south-africa:
 *   get:
 *     summary: Get weather for all major South African cities
 *     tags: [Weather]
 *     responses:
 *       200:
 *         description: Weather data for 10 major South African cities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Weather'
 *                 count:
 *                   type: number
 *                   example: 10
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/south-africa', async (_req: Request, res: Response) => {
  try {
    const weatherPromises = SOUTH_AFRICAN_CITIES.map((city) => getWeatherUseCase.execute({ city }));

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
 * @swagger
 * /api/weather/multi:
 *   get:
 *     summary: Get weather for multiple cities
 *     tags: [Weather]
 *     parameters:
 *       - in: query
 *         name: cities
 *         required: true
 *         schema:
 *           type: string
 *         description: Comma-separated list of city names
 *         example: London,Paris,Berlin
 *     responses:
 *       200:
 *         description: Weather data for the specified cities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Weather'
 *                 count:
 *                   type: number
 *                   example: 3
 *       400:
 *         description: Missing cities parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
    const weatherPromises = cityList.map((city) => getWeatherUseCase.execute({ city }));

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
