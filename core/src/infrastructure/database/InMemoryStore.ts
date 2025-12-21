import { IDataStore } from '../../domain/repositories';

/**
 * In-Memory Data Store Implementation
 *
 * A simple key-value store using JavaScript Map.
 * Data persists as long as the server is running.
 *
 * Implements: IDataStore<T>
 * Follows: Single Responsibility Principle (SRP)
 */
export class InMemoryStore<T> implements IDataStore<T> {
  private store: Map<string, T>;

  constructor() {
    this.store = new Map<string, T>();
  }

  /**
   * Get a single item by ID
   */
  get(id: string): T | undefined {
    return this.store.get(id);
  }

  /**
   * Get all items as an array
   */
  getAll(): T[] {
    return Array.from(this.store.values());
  }

  /**
   * Store or update an item
   */
  set(id: string, value: T): void {
    this.store.set(id, value);
  }

  /**
   * Delete an item by ID
   * @returns true if item was deleted, false if not found
   */
  delete(id: string): boolean {
    return this.store.delete(id);
  }

  /**
   * Check if an item exists
   */
  has(id: string): boolean {
    return this.store.has(id);
  }

  /**
   * Get the total count of items
   */
  count(): number {
    return this.store.size;
  }

  /**
   * Clear all items
   */
  clear(): void {
    this.store.clear();
  }
}
