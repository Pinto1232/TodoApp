import { Weather, WeatherQueryDTO } from '../entities/Weather';

/**
 * Weather Service Interface
 * 
 * Defines the contract for fetching weather data.
 * Implementations can use different weather APIs.
 * 
 * Follows: Dependency Inversion Principle (DIP)
 */
export interface IWeatherService {
  /**
   * Get current weather for a location
   */
  getCurrentWeather(query: WeatherQueryDTO): Promise<Weather>;
}
