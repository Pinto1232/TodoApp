'use client';

import { useState, useEffect, useRef } from 'react';
import { LocationIcon } from '../icons';

interface WeatherData {
  location: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  description: string;
  icon: string;
  windSpeed: number;
  timestamp: string;
}

const API_BASE_URL = 'http://localhost:3001/api';

// Map OpenWeatherMap icons to weather conditions for styling
const getWeatherGradient = (icon: string): string => {
  if (icon.includes('01')) return 'from-yellow-400 to-orange-400'; // clear sky
  if (icon.includes('02')) return 'from-sky-400 to-blue-400'; // few clouds
  if (icon.includes('03') || icon.includes('04')) return 'from-gray-400 to-slate-500'; // clouds
  if (icon.includes('09') || icon.includes('10')) return 'from-blue-500 to-indigo-600'; // rain
  if (icon.includes('11')) return 'from-purple-600 to-indigo-800'; // thunderstorm
  if (icon.includes('13')) return 'from-blue-200 to-slate-300'; // snow
  if (icon.includes('50')) return 'from-gray-300 to-gray-500'; // mist
  return 'from-sky-400 to-blue-300';
};

const getWeatherEmoji = (icon: string): string => {
  if (icon.includes('01')) return '☀️';
  if (icon.includes('02')) return '⛅';
  if (icon.includes('03') || icon.includes('04')) return '☁️';
  if (icon.includes('09')) return '🌧️';
  if (icon.includes('10')) return '🌦️';
  if (icon.includes('11')) return '⛈️';
  if (icon.includes('13')) return '❄️';
  if (icon.includes('50')) return '🌫️';
  return '🌤️';
};

export function WeatherSlider() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Fetch South Africa weather data
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/weather/south-africa`);
        if (!response.ok) throw new Error('Failed to fetch weather');
        const result = await response.json();
        setWeatherData(result.data || []);
        console.log('🇿🇦 SA Weather loaded:', result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load weather');
        console.error('❌ Error fetching weather:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, []);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (weatherData.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % weatherData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [weatherData.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + weatherData.length) % weatherData.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % weatherData.length);
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-sky-400 to-blue-300 rounded-xl p-6 animate-pulse">
        <div className="h-16 bg-white/20 rounded mb-4"></div>
        <div className="h-4 bg-white/20 rounded w-2/3 mb-2"></div>
        <div className="h-4 bg-white/20 rounded w-1/2"></div>
      </div>
    );
  }

  if (error || weatherData.length === 0) {
    return (
      <div className="bg-gradient-to-r from-gray-400 to-gray-500 rounded-xl p-6 text-white">
        <p>Unable to load weather data</p>
      </div>
    );
  }

  const currentWeather = weatherData[currentIndex];
  const currentDate = new Date();
  const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
  const day = currentDate.getDate();
  const month = currentDate.toLocaleDateString('en-US', { month: 'long' });

  return (
    <div className="relative">
      {/* Main Weather Card */}
      <div
        ref={sliderRef}
        className={`relative bg-gradient-to-r ${getWeatherGradient(currentWeather.icon)} rounded-xl p-6 overflow-hidden transition-all duration-500`}
      >
        {/* Weather emoji decoration */}
        <div className="absolute top-4 right-4 text-4xl opacity-80">
          {getWeatherEmoji(currentWeather.icon)}
        </div>

        {/* Navigation arrows */}
        <button
          onClick={goToPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          aria-label="Previous city"
        >
          ‹
        </button>
        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          aria-label="Next city"
        >
          ›
        </button>

        {/* Temperature */}
        <div className="flex items-end gap-2">
          <span className="text-6xl font-light text-white">
            {Math.round(currentWeather.temperature)}
          </span>
          <span className="text-2xl text-white mb-2">°C</span>
        </div>

        {/* Weather description */}
        <p className="text-white/90 text-sm capitalize mt-1">
          {currentWeather.description}
        </p>

        {/* Date and location */}
        <div className="text-white mt-3">
          <p className="font-medium">
            {dayName}, {day} {month}
          </p>
          <p className="flex items-center gap-1 text-sm opacity-90">
            <LocationIcon className="w-4 h-4" />
            {currentWeather.location}, South Africa
          </p>
        </div>

        {/* Weather details */}
        <div className="flex gap-4 mt-4 text-white/80 text-xs">
          <span>💧 {currentWeather.humidity}%</span>
          <span>🌡️ Feels like {Math.round(currentWeather.feelsLike)}°</span>
          <span>💨 {currentWeather.windSpeed} m/s</span>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-3">
        {weatherData.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-amber-500 w-6'
                : 'bg-gray-400 hover:bg-gray-500'
            }`}
            aria-label={`Go to ${weatherData[index]?.location}`}
          />
        ))}
      </div>

      {/* City name labels (visible on hover) */}
      <div className="flex justify-center gap-1 mt-2 flex-wrap">
        {weatherData.map((city, index) => (
          <button
            key={city.location}
            onClick={() => goToSlide(index)}
            className={`text-xs px-2 py-1 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-amber-500 text-white'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {city.location}
          </button>
        ))}
      </div>
    </div>
  );
}
