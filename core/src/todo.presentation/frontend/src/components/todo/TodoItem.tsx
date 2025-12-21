'use client';

import { useState, KeyboardEvent } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CheckIcon, TrashIcon, EditIcon, DragHandleIcon } from '../icons';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = () => {
    if (editText.trim() && editText.trim() !== todo.text) {
      onUpdate(todo.id, editText.trim());
    } else {
      setEditText(todo.text);
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center justify-between py-2 sm:py-3 px-2 sm:px-3 -mx-2 sm:-mx-3 border-b border-[#d4d4d4] last:border-b-0 bg-[#F1ECE6] rounded-lg transition-all duration-300 ease-out cursor-pointer hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 hover:shadow-md md:hover:scale-[1.02] hover:border-amber-200 md:hover:-translate-y-0.5 ${isDragging ? 'z-10 shadow-lg scale-105' : ''}`}
    >
      <div className="flex items-center gap-3 flex-1">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 touch-none"
          aria-label="Drag to reorder"
        >
          <DragHandleIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => onToggle(todo.id)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
            todo.completed
              ? 'bg-amber-500 border-amber-500'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {todo.completed && <CheckIcon className="w-4 h-4 text-white" />}
        </button>
        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyPress}
            onBlur={handleSave}
            autoFocus
            className="flex-1 px-2 py-1 text-gray-700 bg-white border border-gray-300 rounded focus:outline-none focus:border-amber-500"
          />
        ) : (
          <span
            className={`text-gray-700 flex-1 ${
              todo.completed ? 'line-through text-gray-400' : ''
            }`}
          >
            {todo.text}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-400 hover:text-amber-500 hover:scale-110 transition-all duration-200"
            aria-label="Edit todo"
          >
            <EditIcon className="w-5 h-5" />
          </button>
        )}
        {todo.completed && (
          <button
            onClick={() => onDelete(todo.id)}
            className="text-red-300 hover:text-red-500 hover:scale-110 transition-all duration-200"
            aria-label="Delete todo"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
