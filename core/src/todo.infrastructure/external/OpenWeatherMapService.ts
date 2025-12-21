import { Weather, WeatherQueryDTO } from '../../todo.domain/entities/Weather';
import { IWeatherService } from '../../todo.domain/repositories/IWeatherService';
import { createLogger } from '../../todo.shared';

const logger = createLogger('WeatherService');

/**
 * OpenWeatherMap API Response Types
 */
interface OpenWeatherResponse {
  name: string;
  sys: {
    country: string;
  };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

/**
 * OpenWeatherMap Service Implementation
 *
 * Fetches weather data from OpenWeatherMap API.
 *
 * Follows: Single Responsibility Principle (SRP)
 * Follows: Liskov Substitution Principle (LSP)
 */
export class OpenWeatherMapService implements IWeatherService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
  private readonly defaultCity = 'Kaduna'; // Default location

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENWEATHERMAP_API_KEY || '';
  }

  async getCurrentWeather(query: WeatherQueryDTO): Promise<Weather> {
    const city = query.city || this.defaultCity;

    // If no API key, return mock data
    if (!this.apiKey) {
      return this.getMockWeather(city);
    }

    try {
      const url = `${this.baseUrl}?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = (await response.json()) as OpenWeatherResponse;
      return this.mapToWeather(data);
    } catch (error) {
      logger.warn('Failed to fetch weather from API, using mock data', { error: String(error) });
      return this.getMockWeather(city);
    }
  }

  private mapToWeather(data: OpenWeatherResponse): Weather {
    return {
      location: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      description: data.weather[0]?.description || 'Unknown',
      icon: data.weather[0]?.icon || '01d',
      windSpeed: data.wind.speed,
      timestamp: new Date(),
    };
  }

  private getMockWeather(city: string): Weather {
    return {
      location: city,
      country: 'NG',
      temperature: 27,
      feelsLike: 29,
      humidity: 65,
      description: 'clear sky',
      icon: '01d',
      windSpeed: 3.5,
      timestamp: new Date(),
    };
  }
}
