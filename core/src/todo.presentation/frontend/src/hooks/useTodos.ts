import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { todoApi } from '../services';
import type { Todo } from '../components';

export const todoKeys = {
  all: ['todos'] as const,
  list: () => [...todoKeys.all, 'list'] as const,
};

export function useTodos() {
  return useQuery({
    queryKey: todoKeys.list(),
    queryFn: todoApi.getAll,
  });
}

export function useAddTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: todoApi.create,
    onSuccess: (newTodo) => {
      queryClient.setQueryData<Todo[]>(todoKeys.list(), (old) =>
        old ? [...old, newTodo] : [newTodo],
      );
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Pick<Todo, 'text' | 'completed'>> }) =>
      todoApi.update(id, data),
    onSuccess: (updatedTodo) => {
      queryClient.setQueryData<Todo[]>(todoKeys.list(), (old) =>
        old?.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)),
      );
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: todoApi.delete,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<Todo[]>(todoKeys.list(), (old) =>
        old?.filter((todo) => todo.id !== deletedId),
      );
    },
  });
}
