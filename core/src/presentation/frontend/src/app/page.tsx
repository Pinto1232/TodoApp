'use client';

import { useState } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Personal Work No. 1', completed: true },
    { id: 2, text: 'Personal Work No. 2', completed: false },
    { id: 3, text: 'Personal Work No. 3', completed: false },
    { id: 4, text: 'Personal Work No. 4', completed: true },
    { id: 5, text: 'Personal Work No. 5', completed: false },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [hideCompleted, setHideCompleted] = useState(false);

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([
        ...todos,
        { id: Date.now(), text: inputValue.trim(), completed: false },
      ]);
      setInputValue('');
    }
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

  // Get current date
  const currentDate = new Date();
  const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
  const day = currentDate.getDate();
  const month = currentDate.toLocaleDateString('en-US', { month: 'long' });

  return (
    <main className="min-h-screen bg-[#2d3748] p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <h1 className="text-gray-400 text-sm mb-4">To-Do Personal</h1>

        {/* Main Card */}
        <div className="bg-[#f5f5f5] rounded-2xl p-6 md:p-8 shadow-lg">
          {/* Input Section */}
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="What do you need to do?"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-teal-500 text-gray-700 placeholder-gray-400"
            />
            <button
              onClick={addTodo}
              className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg transition-colors"
            >
              ADD
            </button>
          </div>

          {/* Hide Completed Link */}
          <div className="text-right mb-4">
            <button
              onClick={() => setHideCompleted(!hideCompleted)}
              className="text-amber-500 hover:text-amber-600 text-sm font-medium"
            >
              {hideCompleted ? 'Show Completed' : 'Hide Completed'}
            </button>
          </div>

          {/* Todo List */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            {filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      todo.completed
                        ? 'bg-amber-500 border-amber-500'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {todo.completed && (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                  <span
                    className={`text-gray-700 ${
                      todo.completed ? 'line-through text-gray-400' : ''
                    }`}
                  >
                    {todo.text}
                  </span>
                </div>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-300 hover:text-red-500 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))}
            {filteredTodos.length === 0 && (
              <p className="text-gray-400 text-center py-4">No tasks to show</p>
            )}
          </div>

          {/* Weather Widget */}
          <div className="relative bg-gradient-to-r from-sky-400 to-blue-300 rounded-xl p-6 overflow-hidden">
            {/* Sun decoration */}
            <div className="absolute top-4 right-16 w-16 h-16 bg-yellow-300 rounded-full opacity-80"></div>
            
            {/* Sun icon */}
            <div className="absolute top-6 right-6">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>

            <div className="flex items-end gap-2">
              <span className="text-6xl font-light text-white">27</span>
              <span className="text-2xl text-white mb-2">°</span>
            </div>
            <div className="text-white mt-2">
              <p className="font-medium">{dayName}, {day} {month}</p>
              <p className="flex items-center gap-1 text-sm opacity-90">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                Gonin Gora, Kad
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
