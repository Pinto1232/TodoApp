'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [direction, setDirection] = useState(1); 

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/weather/south-africa`);
        if (!response.ok) throw new Error('Failed to fetch weather');
        const result = await response.json();
        setWeatherData(result.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load weather');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, []);

  useEffect(() => {
    if (weatherData.length === 0) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % weatherData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [weatherData.length]);

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const goToPrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + weatherData.length) % weatherData.length);
  };

  const goToNext = () => {
    setDirection(1);
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

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.9,
    }),
  };

  const floatVariants = {
    animate: {
      y: [0, -10, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeOut' as const },
    },
  };

  return (
    <div className="relative">
      {/* Main Weather Card */}
      <div className={`relative bg-gradient-to-r ${getWeatherGradient(currentWeather.icon)} rounded-xl overflow-hidden min-h-[200px]`}>
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              initial={{ x: Math.random() * 300, y: 200 }}
              animate={{
                y: -20,
                x: Math.random() * 300,
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.5,
                ease: 'linear',
              }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="p-6"
          >
            {/* Weather emoji decoration with float animation */}
            <motion.div
              className="absolute top-4 right-4 text-5xl"
              variants={floatVariants}
              animate="animate"
            >
              {getWeatherEmoji(currentWeather.icon)}
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Temperature with count-up effect */}
              <motion.div 
                className="flex items-end gap-2"
                variants={itemVariants}
              >
                <motion.span
                  className="text-6xl font-light text-white"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                >
                  {Math.round(currentWeather.temperature)}
                </motion.span>
                <span className="text-2xl text-white mb-2">°C</span>
              </motion.div>

              {/* Weather description */}
              <motion.p 
                className="text-white/90 text-sm capitalize mt-1"
                variants={itemVariants}
              >
                {currentWeather.description}
              </motion.p>

              {/* Date and location */}
              <motion.div className="text-white mt-3" variants={itemVariants}>
                <p className="font-medium">
                  {dayName}, {day} {month}
                </p>
                <p className="flex items-center gap-1 text-sm opacity-90">
                  <LocationIcon className="w-4 h-4" />
                  {currentWeather.location}, South Africa
                </p>
              </motion.div>

              {/* Weather details */}
              <motion.div 
                className="flex gap-4 mt-4 text-white/80 text-xs"
                variants={itemVariants}
              >
                <motion.span whileHover={{ scale: 1.1 }}>💧 {currentWeather.humidity}%</motion.span>
                <motion.span whileHover={{ scale: 1.1 }}>🌡️ Feels like {Math.round(currentWeather.feelsLike)}°</motion.span>
                <motion.span whileHover={{ scale: 1.1 }}>💨 {currentWeather.windSpeed} m/s</motion.span>
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        <motion.button
          onClick={goToPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors z-10"
          aria-label="Previous city"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          ‹
        </motion.button>
        <motion.button
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors z-10"
          aria-label="Next city"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          ›
        </motion.button>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-3">
        {weatherData.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full ${
              index === currentIndex
                ? 'bg-amber-500'
                : 'bg-gray-400 hover:bg-gray-500'
            }`}
            animate={{ width: index === currentIndex ? 24 : 8 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.2 }}
            aria-label={`Go to ${weatherData[index]?.location}`}
          />
        ))}
      </div>

      {/* City name labels */}
      <div className="flex justify-center gap-1 mt-2 flex-wrap">
        {weatherData.map((city, index) => (
          <motion.button
            key={city.location}
            onClick={() => goToSlide(index)}
            className={`text-xs px-2 py-1 rounded-full ${
              index === currentIndex
                ? 'bg-amber-500 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            animate={index === currentIndex ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {city.location}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
