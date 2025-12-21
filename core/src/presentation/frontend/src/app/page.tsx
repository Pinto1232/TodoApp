'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  PageHeader,
  TodoInput,
  TodoFilter,
  TodoList,
  WeatherSlider,
  Todo,
  ConfirmSnackbar,
} from '../components';

const API_BASE_URL = 'http://localhost:3001/api';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hideCompleted, setHideCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; todoId: string | null; todoText: string }>({
    isOpen: false,
    todoId: null,
    todoText: '',
  });

  // Fetch todos from API
  const fetchTodos = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/todos`);
      if (!response.ok) throw new Error('Failed to fetch todos');
      const result = await response.json();
      // API returns { success, data, count } wrapper
      setTodos(result.data || []);
      console.log('📋 Todos loaded:', result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load todos');
      console.error('❌ Error fetching todos:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load todos on mount
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Add todo via API
  const addTodo = async (text: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) throw new Error('Failed to add todo');
      const result = await response.json();
      setTodos((prev) => [...prev, result.data]);
      console.log('✅ Todo added:', result.data);
    } catch (err) {
      console.error('❌ Error adding todo:', err);
      setError(err instanceof Error ? err.message : 'Failed to add todo');
    }
  };

  // Toggle todo via API
  const toggleTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      if (!response.ok) throw new Error('Failed to update todo');
      const result = await response.json();
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? result.data : t))
      );
      console.log('✅ Todo toggled:', result.data);
    } catch (err) {
      console.error('❌ Error toggling todo:', err);
      setError(err instanceof Error ? err.message : 'Failed to update todo');
    }
  };

  // Update todo text via API
  const updateTodo = async (id: string, text: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) throw new Error('Failed to update todo');
      const result = await response.json();
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? result.data : t))
      );
      console.log('✏️ Todo updated:', result.data);
    } catch (err) {
      console.error('❌ Error updating todo:', err);
      setError(err instanceof Error ? err.message : 'Failed to update todo');
    }
  };

  // Delete todo via API
  const deleteTodo = (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    setDeleteConfirm({ isOpen: true, todoId: id, todoText: todo.text });
  };

  // Confirm delete
  const confirmDelete = async () => {
    const id = deleteConfirm.todoId;
    if (!id) return;

    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete todo');
      setTodos((prev) => prev.filter((t) => t.id !== id));
      console.log('🗑️ Todo deleted:', id);
    } catch (err) {
      console.error('❌ Error deleting todo:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
    } finally {
      setDeleteConfirm({ isOpen: false, todoId: null, todoText: '' });
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteConfirm({ isOpen: false, todoId: null, todoText: '' });
  };

  // Reorder todos by drag and drop
  const reorderTodos = (activeId: string, overId: string) => {
    setTodos((prev) => {
      const oldIndex = prev.findIndex((t) => t.id === activeId);
      const newIndex = prev.findIndex((t) => t.id === overId);

      if (oldIndex === -1 || newIndex === -1) return prev;

      const newTodos = [...prev];
      const [removed] = newTodos.splice(oldIndex, 1);
      newTodos.splice(newIndex, 0, removed);

      console.log('🔄 Todos reordered');
      return newTodos;
    });
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

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
              <button
                onClick={() => setError(null)}
                className="float-right font-bold"
              >
                ×
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-8 text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-2"></div>
              Loading todos...
            </div>
          ) : (
            <TodoList
              todos={filteredTodos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onUpdate={updateTodo}
              onReorder={reorderTodos}
              emptyMessage="No todos yet. Add one above!"
            />
          )}

          <WeatherSlider />
        </Card>
      </div>

      <ConfirmSnackbar
        isOpen={deleteConfirm.isOpen}
        message={`Delete "${deleteConfirm.todoText}"?`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </main>
  );
}
