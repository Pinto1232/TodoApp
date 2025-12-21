import { Todo, CreateTodoDTO, createTodo } from '../../domain/entities';
import { ITodoRepository } from '../../domain/repositories';
import { InMemoryStore } from './InMemoryStore';

/**
 * In-Memory Todo Repository Implementation
 * 
 * Implements ITodoRepository using InMemoryStore.
 * 
 * Follows: Single Responsibility Principle (SRP)
 * Follows: Liskov Substitution Principle (LSP)
 */
export class TodoRepository implements ITodoRepository {
  private store: InMemoryStore<Todo>;

  constructor() {
    this.store = new InMemoryStore<Todo>();
    this.seedData();
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
