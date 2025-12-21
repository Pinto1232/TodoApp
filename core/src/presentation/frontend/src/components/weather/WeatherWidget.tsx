'use client';

import { SunIcon, LocationIcon } from '../icons';

interface WeatherWidgetProps {
  temperature?: number;
  location?: string;
}

export function WeatherWidget({
  temperature = 27,
  location = 'Gonin Gora, Kad',
}: WeatherWidgetProps) {
  const currentDate = new Date();
  const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
  const day = currentDate.getDate();
  const month = currentDate.toLocaleDateString('en-US', { month: 'long' });

  return (
    <div className="relative bg-gradient-to-r from-sky-400 to-blue-300 rounded-xl p-6 overflow-hidden">
      {/* Sun decoration */}
      <div className="absolute top-4 right-16 w-16 h-16 bg-yellow-300 rounded-full opacity-80"></div>

      {/* Sun icon */}
      <div className="absolute top-6 right-6">
        <SunIcon className="w-10 h-10 text-white" />
      </div>

      <div className="flex items-end gap-2">
        <span className="text-6xl font-light text-white">{temperature}</span>
        <span className="text-2xl text-white mb-2">°</span>
      </div>
      <div className="text-white mt-2">
        <p className="font-medium">
          {dayName}, {day} {month}
        </p>
        <p className="flex items-center gap-1 text-sm opacity-90">
          <LocationIcon className="w-4 h-4" />
          {location}
        </p>
      </div>
    </div>
  );
}
