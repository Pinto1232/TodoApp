'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Card,
  PageHeader,
  TodoInput,
  TodoFilter,
  TodoList,
  WeatherSlider,
  ConfirmSnackbar,
  Snackbar,
} from '../components';
import { useTodos, useAddTodo, useUpdateTodo, useDeleteTodo, todoKeys } from '../hooks';
import type { Todo } from '../components';

export default function Home() {
  const [hideCompleted, setHideCompleted] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; todoId: string | null; todoText: string }>({
    isOpen: false,
    todoId: null,
    todoText: '',
  });
  const [snackbar, setSnackbar] = useState<{ isOpen: boolean; message: string; variant: 'success' | 'error' | 'info' }>({
    isOpen: false,
    message: '',
    variant: 'success',
  });

  const queryClient = useQueryClient();
  const { data: todos = [], isLoading, error } = useTodos();
  const addTodoMutation = useAddTodo();
  const updateTodoMutation = useUpdateTodo();
  const deleteTodoMutation = useDeleteTodo();

  const addTodo = (text: string) => {
    addTodoMutation.mutate(text, {
      onSuccess: () => {
        setSnackbar({ isOpen: true, message: 'Todo added successfully!', variant: 'success' });
      },
    });
  };

  const toggleTodo = (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    updateTodoMutation.mutate({ id, data: { completed: !todo.completed } });
  };

  const updateTodo = (id: string, text: string) => {
    updateTodoMutation.mutate({ id, data: { text } });
  };

  const deleteTodo = (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    setDeleteConfirm({ isOpen: true, todoId: id, todoText: todo.text });
  };

  const confirmDelete = () => {
    const id = deleteConfirm.todoId;
    if (!id) return;
    deleteTodoMutation.mutate(id, {
      onSettled: () => {
        setDeleteConfirm({ isOpen: false, todoId: null, todoText: '' });
      },
    });
  };

  const cancelDelete = () => {
    setDeleteConfirm({ isOpen: false, todoId: null, todoText: '' });
  };

  const reorderTodos = (activeId: string, overId: string) => {
    queryClient.setQueryData<Todo[]>(todoKeys.list(), (prev) => {
      if (!prev) return prev;
      const oldIndex = prev.findIndex((t) => t.id === activeId);
      const newIndex = prev.findIndex((t) => t.id === overId);

      if (oldIndex === -1 || newIndex === -1) return prev;

      const newTodos = [...prev];
      const [removed] = newTodos.splice(oldIndex, 1);
      newTodos.splice(newIndex, 0, removed);

      return newTodos;
    });
  };

  const filteredTodos = hideCompleted
    ? todos.filter((todo) => !todo.completed)
    : todos;

  const mutationError = addTodoMutation.error || updateTodoMutation.error || deleteTodoMutation.error;
  const displayError = error || mutationError;

  return (
    <main className="min-h-screen bg-[#2d3748] p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <PageHeader title="To-Do Personal" className="mb-0" />
          <button
            onClick={() => window.open('http://localhost:3001/api/docs', 'API Documentation', 'width=1200,height=800,menubar=no,toolbar=no,location=no,status=no')}
            className="text-amber-500 hover:text-amber-400 text-sm flex items-center gap-1 transition-colors cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            API Docs
          </button>
        </div>

        <Card variant="elevated" className="p-6 md:p-8">
          <TodoInput onAdd={addTodo} disabled={addTodoMutation.isPending} />

          <TodoFilter
            hideCompleted={hideCompleted}
            onToggle={() => setHideCompleted(!hideCompleted)}
          />

          {displayError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {displayError instanceof Error ? displayError.message : 'An error occurred'}
              <button
                onClick={() => {
                  addTodoMutation.reset();
                  updateTodoMutation.reset();
                  deleteTodoMutation.reset();
                }}
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

      <Snackbar
        isOpen={snackbar.isOpen}
        message={snackbar.message}
        variant={snackbar.variant}
        onClose={() => setSnackbar((prev) => ({ ...prev, isOpen: false }))}
      />
    </main>
  );
}
