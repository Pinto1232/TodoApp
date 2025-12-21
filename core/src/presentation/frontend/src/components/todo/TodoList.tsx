'use client';

import { Card } from '../ui';
import { TodoItem, Todo } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  emptyMessage?: string;
}

export function TodoList({
  todos,
  onToggle,
  onDelete,
  emptyMessage = 'No tasks to show',
}: TodoListProps) {
  return (
    <Card className="p-4 mb-6">
      {todos.length > 0 ? (
        todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))
      ) : (
        <p className="text-gray-400 text-center py-4">{emptyMessage}</p>
      )}
    </Card>
  );
}
