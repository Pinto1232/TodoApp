'use client';

import { useState } from 'react';
import {
  Card,
  PageHeader,
  TodoInput,
  TodoFilter,
  TodoList,
  WeatherWidget,
  Todo,
} from '../components';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Personal Work No. 1', completed: true },
    { id: 2, text: 'Personal Work No. 2', completed: false },
    { id: 3, text: 'Personal Work No. 3', completed: false },
    { id: 4, text: 'Personal Work No. 4', completed: true },
    { id: 5, text: 'Personal Work No. 5', completed: false },
  ]);
  const [hideCompleted, setHideCompleted] = useState(false);

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
