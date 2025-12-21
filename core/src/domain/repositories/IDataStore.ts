/**
 * Generic Data Store Interface
 *
 * This abstraction allows us to swap storage implementations
 * (in-memory, file, database) without changing business logic.
 *
 * Follows: Dependency Inversion Principle (DIP)
 */
export interface IDataStore<T> {
  /**
   * Get a single item by ID
   */
  get(id: string): T | undefined;

  /**
   * Get all items
   */
  getAll(): T[];

  /**
   * Store or update an item
   */
  set(id: string, value: T): void;

  /**
   * Delete an item by ID
   * @returns true if item was deleted, false if not found
   */
  delete(id: string): boolean;

  /**
   * Check if an item exists
   */
  has(id: string): boolean;

  /**
   * Get the total count of items
   */
  count(): number;

  /**
   * Clear all items
   */
  clear(): void;
}
