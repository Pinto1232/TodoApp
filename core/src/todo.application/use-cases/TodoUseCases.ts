import { Todo, CreateTodoDTO } from '../../todo.domain/entities';
import { ITodoRepository } from '../../todo.domain/repositories';

/**
 * Get All Todos Use Case
 *
 * Application layer use case for retrieving all todos.
 *
 * Follows: Single Responsibility Principle (SRP)
 */
export class GetTodosUseCase {
  constructor(private todoRepository: ITodoRepository) {}

  execute(): Todo[] {
    return this.todoRepository.findAll();
  }
}

/**
 * Create Todo Use Case
 *
 * Application layer use case for creating a new todo.
 *
 * Follows: Single Responsibility Principle (SRP)
 */
export class CreateTodoUseCase {
  constructor(private todoRepository: ITodoRepository) {}

  execute(dto: CreateTodoDTO): Todo {
    if (!dto.text || dto.text.trim().length === 0) {
      throw new Error('Todo text is required');
    }
    return this.todoRepository.create({ text: dto.text.trim() });
  }
}

/**
 * Update Todo Use Case
 *
 * Application layer use case for updating an existing todo.
 *
 * Follows: Single Responsibility Principle (SRP)
 */
export interface UpdateTodoDTO {
  text?: string;
  completed?: boolean;
}

export class UpdateTodoUseCase {
  constructor(private todoRepository: ITodoRepository) {}

  execute(id: string, dto: UpdateTodoDTO): Todo | null {
    if (!id) {
      throw new Error('Todo ID is required');
    }

    const existing = this.todoRepository.findById(id);
    if (!existing) {
      return null;
    }

    const updates: Partial<Omit<Todo, 'id' | 'createdAt'>> = {};

    if (dto.text !== undefined) {
      if (dto.text.trim().length === 0) {
        throw new Error('Todo text cannot be empty');
      }
      updates.text = dto.text.trim();
    }

    if (dto.completed !== undefined) {
      updates.completed = dto.completed;
    }

    return this.todoRepository.update(id, updates) || null;
  }
}

/**
 * Delete Todo Use Case
 *
 * Application layer use case for deleting a todo.
 *
 * Follows: Single Responsibility Principle (SRP)
 */
export class DeleteTodoUseCase {
  constructor(private todoRepository: ITodoRepository) {}

  execute(id: string): boolean {
    if (!id) {
      throw new Error('Todo ID is required');
    }
    return this.todoRepository.delete(id);
  }
}
