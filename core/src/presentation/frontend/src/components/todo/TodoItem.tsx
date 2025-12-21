'use client';

import { CheckIcon, TrashIcon } from '../icons';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center gap-3">
        <button
          onClick={() => onToggle(todo.id)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            todo.completed
              ? 'bg-amber-500 border-amber-500'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {todo.completed && <CheckIcon className="w-4 h-4 text-white" />}
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
        onClick={() => onDelete(todo.id)}
        className="text-red-300 hover:text-red-500 transition-colors"
        aria-label="Delete todo"
      >
        <TrashIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
