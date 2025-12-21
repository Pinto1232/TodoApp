import { Todo, CreateTodoDTO } from '../../domain/entities';
import { ITodoRepository } from '../../domain/repositories';

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
