import {
  GetTodosUseCase,
  CreateTodoUseCase,
  UpdateTodoUseCase,
  DeleteTodoUseCase,
} from '../../../application/use-cases/TodoUseCases';
import { ITodoRepository } from '../../../domain/repositories/ITodoRepository';
import { Todo } from '../../../domain/entities/Todo';

// Mock repository implementation
const createMockRepository = (): jest.Mocked<ITodoRepository> => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('Todo Use Cases', () => {
  let mockRepository: jest.Mocked<ITodoRepository>;

  const mockTodo: Todo = {
    id: 'test-id-1',
    text: 'Test Todo',
    completed: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockTodos: Todo[] = [
    mockTodo,
    {
      id: 'test-id-2',
      text: 'Second Todo',
      completed: true,
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
    },
  ];

  beforeEach(() => {
    mockRepository = createMockRepository();
  });

  describe('GetTodosUseCase', () => {
    it('should return all todos from repository', () => {
      mockRepository.findAll.mockReturnValue(mockTodos);
      const useCase = new GetTodosUseCase(mockRepository);

      const result = useCase.execute();

      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockTodos);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no todos exist', () => {
      mockRepository.findAll.mockReturnValue([]);
      const useCase = new GetTodosUseCase(mockRepository);

      const result = useCase.execute();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should propagate repository errors', () => {
      const error = new Error('Database error');
      mockRepository.findAll.mockImplementation(() => {
        throw error;
      });
      const useCase = new GetTodosUseCase(mockRepository);

      expect(() => useCase.execute()).toThrow('Database error');
    });
  });

  describe('CreateTodoUseCase', () => {
    it('should create a todo with valid text', () => {
      mockRepository.create.mockReturnValue(mockTodo);
      const useCase = new CreateTodoUseCase(mockRepository);

      const result = useCase.execute({ text: 'Test Todo' });

      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockTodo);
    });

    it('should throw error when text is empty', () => {
      const useCase = new CreateTodoUseCase(mockRepository);

      expect(() => useCase.execute({ text: '' })).toThrow('Todo text is required');
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw error when text is only whitespace', () => {
      const useCase = new CreateTodoUseCase(mockRepository);

      expect(() => useCase.execute({ text: '   ' })).toThrow('Todo text is required');
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should trim whitespace from text', () => {
      mockRepository.create.mockReturnValue(mockTodo);
      const useCase = new CreateTodoUseCase(mockRepository);

      useCase.execute({ text: '  Test Todo  ' });

      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ text: 'Test Todo' }),
      );
    });

    it('should propagate repository errors', () => {
      const error = new Error('Failed to create');
      mockRepository.create.mockImplementation(() => {
        throw error;
      });
      const useCase = new CreateTodoUseCase(mockRepository);

      expect(() => useCase.execute({ text: 'Test' })).toThrow('Failed to create');
    });
  });

  describe('UpdateTodoUseCase', () => {
    it('should update a todo successfully', () => {
      const updatedTodo = { ...mockTodo, text: 'Updated Text', completed: true };
      mockRepository.findById.mockReturnValue(mockTodo);
      mockRepository.update.mockReturnValue(updatedTodo);
      const useCase = new UpdateTodoUseCase(mockRepository);

      const result = useCase.execute('test-id-1', {
        text: 'Updated Text',
        completed: true,
      });

      expect(mockRepository.update).toHaveBeenCalledWith('test-id-1', {
        text: 'Updated Text',
        completed: true,
      });
      expect(result).toEqual(updatedTodo);
    });

    it('should throw error when id is empty', () => {
      const useCase = new UpdateTodoUseCase(mockRepository);

      expect(() => useCase.execute('', { text: 'Test' })).toThrow('Todo ID is required');
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should throw error when text is empty string', () => {
      mockRepository.findById.mockReturnValue(mockTodo);
      const useCase = new UpdateTodoUseCase(mockRepository);

      expect(() => useCase.execute('test-id', { text: '' })).toThrow('Todo text cannot be empty');
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should throw error when text is only whitespace', () => {
      mockRepository.findById.mockReturnValue(mockTodo);
      const useCase = new UpdateTodoUseCase(mockRepository);

      expect(() => useCase.execute('test-id', { text: '   ' })).toThrow(
        'Todo text cannot be empty',
      );
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should allow updating only completed status', () => {
      const updatedTodo = { ...mockTodo, completed: true };
      mockRepository.findById.mockReturnValue(mockTodo);
      mockRepository.update.mockReturnValue(updatedTodo);
      const useCase = new UpdateTodoUseCase(mockRepository);

      const result = useCase.execute('test-id-1', { completed: true });

      expect(mockRepository.update).toHaveBeenCalledWith('test-id-1', {
        completed: true,
      });
      expect(result!.completed).toBe(true);
    });

    it('should return null when todo not found', () => {
      mockRepository.findById.mockReturnValue(undefined);
      const useCase = new UpdateTodoUseCase(mockRepository);

      const result = useCase.execute('non-existent', { text: 'Test' });

      expect(result).toBeNull();
    });

    it('should propagate repository errors', () => {
      const error = new Error('Update failed');
      mockRepository.findById.mockReturnValue(mockTodo);
      mockRepository.update.mockImplementation(() => {
        throw error;
      });
      const useCase = new UpdateTodoUseCase(mockRepository);

      expect(() => useCase.execute('test-id', { text: 'Test' })).toThrow('Update failed');
    });
  });

  describe('DeleteTodoUseCase', () => {
    it('should delete a todo successfully', () => {
      mockRepository.delete.mockReturnValue(true);
      const useCase = new DeleteTodoUseCase(mockRepository);

      const result = useCase.execute('test-id-1');

      expect(mockRepository.delete).toHaveBeenCalledWith('test-id-1');
      expect(result).toBe(true);
    });

    it('should throw error when id is empty', () => {
      const useCase = new DeleteTodoUseCase(mockRepository);

      expect(() => useCase.execute('')).toThrow('Todo ID is required');
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });

    it('should return false when todo not found', () => {
      mockRepository.delete.mockReturnValue(false);
      const useCase = new DeleteTodoUseCase(mockRepository);

      const result = useCase.execute('non-existent');

      expect(result).toBe(false);
    });

    it('should propagate repository errors', () => {
      const error = new Error('Delete failed');
      mockRepository.delete.mockImplementation(() => {
        throw error;
      });
      const useCase = new DeleteTodoUseCase(mockRepository);

      expect(() => useCase.execute('test-id')).toThrow('Delete failed');
    });
  });
});
