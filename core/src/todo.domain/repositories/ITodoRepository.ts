import { Todo, CreateTodoDTO } from '../entities';

/**
 * Todo Repository Interface
 *
 * Defines the contract for Todo data operations.
 * Implementations can be in-memory, database, etc.
 *
 * Follows: Dependency Inversion Principle (DIP)
 * Follows: Interface Segregation Principle (ISP)
 */
export interface ITodoRepository {
  /**
   * Get all todos
   */
  findAll(): Todo[];

  /**
   * Find a todo by ID
   */
  findById(id: string): Todo | undefined;

  /**
   * Create a new todo
   */
  create(dto: CreateTodoDTO): Todo;

  /**
   * Update an existing todo
   */
  update(id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>): Todo | undefined;

  /**
   * Delete a todo by ID
   */
  delete(id: string): boolean;
}
