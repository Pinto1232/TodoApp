import type { Todo } from '../types/todo';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface WeatherData {
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

export const todoApi = {
  getAll: async (): Promise<Todo[]> => {
    const response = await fetch(`${API_BASE_URL}/todos`);
    if (!response.ok) throw new Error('Failed to fetch todos');
    const result: ApiResponse<Todo[]> = await response.json();
    return result.data || [];
  },

  create: async (text: string): Promise<Todo> => {
    const response = await fetch(`${API_BASE_URL}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) throw new Error('Failed to add todo');
    const result: ApiResponse<Todo> = await response.json();
    return result.data;
  },

  update: async (id: string, data: Partial<Pick<Todo, 'text' | 'completed'>>): Promise<Todo> => {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update todo');
    const result: ApiResponse<Todo> = await response.json();
    return result.data;
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete todo');
  },
};

export const weatherApi = {
  getSouthAfrica: async (): Promise<WeatherData[]> => {
    const response = await fetch(`${API_BASE_URL}/weather/south-africa`);
    if (!response.ok) throw new Error('Failed to fetch weather');
    const result: ApiResponse<WeatherData[]> = await response.json();
    return result.data || [];
  },

  getByCity: async (city: string): Promise<WeatherData> => {
    const response = await fetch(`${API_BASE_URL}/weather/${encodeURIComponent(city)}`);
    if (!response.ok) throw new Error('Failed to fetch weather for city');
    const result: ApiResponse<WeatherData> = await response.json();
    return result.data;
  },
};
