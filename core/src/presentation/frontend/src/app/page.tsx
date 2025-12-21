'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  PageHeader,
  TodoInput,
  TodoFilter,
  TodoList,
  WeatherWidget,
  Todo,
} from '../components';

const API_BASE_URL = 'http://localhost:3001/api';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Personal Work No. 1', completed: true },
    { id: 2, text: 'Personal Work No. 2', completed: false },
    { id: 3, text: 'Personal Work No. 3', completed: false },
    { id: 4, text: 'Personal Work No. 4', completed: true },
    { id: 5, text: 'Personal Work No. 5', completed: false },
  ]);
  const [hideCompleted, setHideCompleted] = useState(false);

  // Fetch and log all API endpoint data on mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch Todos
        console.log('📋 Fetching Todos...');
        const todosResponse = await fetch(`${API_BASE_URL}/todos`);
        const todosData = await todosResponse.json();
        console.log('✅ Todos:', todosData);

        // Fetch Weather (default city)
        console.log('🌤️ Fetching Weather (default)...');
        const weatherResponse = await fetch(`${API_BASE_URL}/weather`);
        const weatherData = await weatherResponse.json();
        console.log('✅ Weather:', weatherData);

        // Fetch South Africa Weather
        console.log('🇿🇦 Fetching South Africa Weather...');
        const saWeatherResponse = await fetch(`${API_BASE_URL}/weather/south-africa`);
        const saWeatherData = await saWeatherResponse.json();
        console.log('✅ South Africa Weather:', saWeatherData);

        // Log summary
        console.log('📊 API Data Summary:', {
          todos: todosData,
          weather: weatherData,
          southAfricaWeather: saWeatherData,
        });
      } catch (error) {
        console.error('❌ Error fetching API data:', error);
      }
    };

    fetchAllData();
  }, []);

  const addTodo = (text: string) => {
    setTodos([...todos, { id: Date.now(), text, completed: false }]);
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const filteredTodos = hideCompleted
    ? todos.filter((todo) => !todo.completed)
    : todos;

  return (
    <main className="min-h-screen bg-[#2d3748] p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <PageHeader title="To-Do Personal" />

        <Card variant="elevated" className="p-6 md:p-8">
          <TodoInput onAdd={addTodo} />

          <TodoFilter
            hideCompleted={hideCompleted}
            onToggle={() => setHideCompleted(!hideCompleted)}
          />

          <TodoList
            todos={filteredTodos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />

          <WeatherWidget />
        </Card>
      </div>
    </main>
  );
}
