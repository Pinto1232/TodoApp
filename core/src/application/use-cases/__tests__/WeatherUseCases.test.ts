import { GetWeatherUseCase } from '../../../application/use-cases/WeatherUseCases';
import { IWeatherService } from '../../../domain/repositories/IWeatherService';
import { Weather, WeatherQueryDTO } from '../../../domain/entities/Weather';

// Mock weather service implementation
const createMockWeatherService = (): jest.Mocked<IWeatherService> => ({
  getCurrentWeather: jest.fn(),
});

describe('Weather Use Cases', () => {
  let mockWeatherService: jest.Mocked<IWeatherService>;

  const mockWeather: Weather = {
    location: 'Cape Town',
    country: 'ZA',
    temperature: 22.5,
    feelsLike: 21.0,
    humidity: 65,
    description: 'Clear sky',
    icon: '01d',
    windSpeed: 5.2,
    timestamp: new Date('2024-01-15T10:00:00Z'),
  };

  beforeEach(() => {
    mockWeatherService = createMockWeatherService();
  });

  describe('GetWeatherUseCase', () => {
    it('should get weather by city name', async () => {
      mockWeatherService.getCurrentWeather.mockResolvedValue(mockWeather);
      const useCase = new GetWeatherUseCase(mockWeatherService);

      const query: WeatherQueryDTO = { city: 'Cape Town' };
      const result = await useCase.execute(query);

      expect(mockWeatherService.getCurrentWeather).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockWeather);
      expect(result.location).toBe('Cape Town');
      expect(result.country).toBe('ZA');
    });

    it('should get weather by coordinates', async () => {
      const johannesburgWeather: Weather = {
        ...mockWeather,
        location: 'Johannesburg',
      };
      mockWeatherService.getCurrentWeather.mockResolvedValue(johannesburgWeather);
      const useCase = new GetWeatherUseCase(mockWeatherService);

      const query: WeatherQueryDTO = { lat: -26.2041, lon: 28.0473 };
      const result = await useCase.execute(query);

      expect(mockWeatherService.getCurrentWeather).toHaveBeenCalledWith(query);
      expect(result.location).toBe('Johannesburg');
    });

    it('should use default query when none provided', async () => {
      mockWeatherService.getCurrentWeather.mockResolvedValue(mockWeather);
      const useCase = new GetWeatherUseCase(mockWeatherService);

      await useCase.execute();

      expect(mockWeatherService.getCurrentWeather).toHaveBeenCalledWith({});
    });

    it('should return weather with all required fields', async () => {
      mockWeatherService.getCurrentWeather.mockResolvedValue(mockWeather);
      const useCase = new GetWeatherUseCase(mockWeatherService);

      const result = await useCase.execute({ city: 'Cape Town' });

      expect(result).toHaveProperty('location');
      expect(result).toHaveProperty('country');
      expect(result).toHaveProperty('temperature');
      expect(result).toHaveProperty('feelsLike');
      expect(result).toHaveProperty('humidity');
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('icon');
      expect(result).toHaveProperty('windSpeed');
      expect(result).toHaveProperty('timestamp');
    });

    it('should propagate service errors', async () => {
      const error = new Error('Weather API unavailable');
      mockWeatherService.getCurrentWeather.mockRejectedValue(error);
      const useCase = new GetWeatherUseCase(mockWeatherService);

      await expect(useCase.execute({ city: 'Invalid' })).rejects.toThrow(
        'Weather API unavailable'
      );
    });

    it('should handle network errors gracefully', async () => {
      const networkError = new Error('Network error');
      mockWeatherService.getCurrentWeather.mockRejectedValue(networkError);
      const useCase = new GetWeatherUseCase(mockWeatherService);

      await expect(useCase.execute({ city: 'Test' })).rejects.toThrow(
        'Network error'
      );
    });
  });
});
