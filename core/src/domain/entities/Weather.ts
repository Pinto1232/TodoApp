/**
 * Weather Entity
 *
 * Core business entity representing weather data.
 * This is a pure domain object with no external dependencies.
 */
export interface Weather {
  location: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  description: string;
  icon: string;
  windSpeed: number;
  timestamp: Date;
}

/**
 * Weather Query DTO
 */
export interface WeatherQueryDTO {
  city?: string;
  lat?: number;
  lon?: number;
}
