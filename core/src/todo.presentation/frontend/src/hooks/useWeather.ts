import { useQuery } from '@tanstack/react-query';
import { weatherApi } from '../services';

export const weatherKeys = {
  all: ['weather'] as const,
  southAfrica: () => [...weatherKeys.all, 'south-africa'] as const,
  city: (city: string) => [...weatherKeys.all, 'city', city] as const,
};

export function useWeatherSouthAfrica() {
  return useQuery({
    queryKey: weatherKeys.southAfrica(),
    queryFn: async () => {
      const weatherData = await weatherApi.getSouthAfrica();
      console.log('🌤️ South Africa Weather Data:', weatherData);
      return weatherData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - weather doesn't change that often
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
}

export function useWeatherByCity(city: string) {
  return useQuery({
    queryKey: weatherKeys.city(city),
    queryFn: () => weatherApi.getByCity(city),
    enabled: !!city,
    staleTime: 5 * 60 * 1000,
  });
}
