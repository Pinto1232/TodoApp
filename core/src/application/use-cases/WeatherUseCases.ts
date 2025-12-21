import { Weather, WeatherQueryDTO } from '../../domain/entities/Weather';
import { IWeatherService } from '../../domain/repositories/IWeatherService';

/**
 * Get Weather Use Case
 *
 * Application layer use case for retrieving weather data.
 *
 * Follows: Single Responsibility Principle (SRP)
 */
export class GetWeatherUseCase {
  constructor(private weatherService: IWeatherService) {}

  async execute(query: WeatherQueryDTO = {}): Promise<Weather> {
    return this.weatherService.getCurrentWeather(query);
  }
}
