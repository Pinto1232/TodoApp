import { Todo, CreateTodoDTO, createTodo } from '../../todo.domain/entities';
import { IDataStore, ITodoRepository } from '../../todo.domain/repositories';
import { JsonFileStore } from './JsonFileStore';

/**
 * Persistent Todo Repository Implementation
 *
 * Implements ITodoRepository using JsonFileStore for permanent storage.
 * Data is saved to a JSON file and persists across server restarts.
 *
 * Follows: Single Responsibility Principle (SRP)
 * Follows: Liskov Substitution Principle (LSP)
 */
export class TodoRepository implements ITodoRepository {
  private store: IDataStore<Todo>;

  constructor(store: IDataStore<Todo> = new JsonFileStore<Todo>('todos.json')) {
    this.store = store;
    
    // Only seed data if store is empty (first run)
    if (this.store.count() === 0) {
      this.seedData();
    }
  }

  /**
   * Seed initial data for demonstration
   */
  private seedData(): void {
    const initialTodos: CreateTodoDTO[] = [
      { text: 'Personal Work No. 1' },
      { text: 'Personal Work No. 2' },
      { text: 'Personal Work No. 3' },
      { text: 'Personal Work No. 4' },
      { text: 'Personal Work No. 5' },
    ];

    initialTodos.forEach((dto, index) => {
      const todo = createTodo(dto);
      // Mark some as completed for variety
      if (index === 0 || index === 3) {
        todo.completed = true;
      }
      this.store.set(todo.id, todo);
    });
  }

  findAll(): Todo[] {
    return this.store.getAll();
  }

  findById(id: string): Todo | undefined {
    return this.store.get(id);
  }

  create(dto: CreateTodoDTO): Todo {
    const todo = createTodo(dto);
    this.store.set(todo.id, todo);
    return todo;
  }

  update(id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>): Todo | undefined {
    const existing = this.store.get(id);
    if (!existing) {
      return undefined;
    }

    const updated: Todo = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };

    this.store.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.store.delete(id);
  }
}
