import * as fs from 'fs';
import * as path from 'path';
import { IDataStore } from '../../todo.domain/repositories';

/**
 * File-based JSON Data Store Implementation
 *
 * Persists data to a JSON file on disk.
 * Data survives server restarts.
 *
 * Implements: IDataStore<T>
 * Follows: Single Responsibility Principle (SRP)
 */
export class JsonFileStore<T> implements IDataStore<T> {
  private store: Map<string, T>;
  private filePath: string;

  constructor(fileName: string = 'data.json') {
    this.store = new Map<string, T>();
    
    // Store in a data directory at the project root
    const dataDir = path.join(process.cwd(), 'data');
    
    // Create data directory if it doesn't exist
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    this.filePath = path.join(dataDir, fileName);
    this.loadFromFile();
  }

  /**
   * Load data from JSON file
   */
  private loadFromFile(): void {
    try {
      if (fs.existsSync(this.filePath)) {
        const data = fs.readFileSync(this.filePath, 'utf-8');
        const parsed = JSON.parse(data);
        
        // Convert array of [key, value] pairs back to Map
        if (Array.isArray(parsed)) {
          parsed.forEach(([key, value]) => {
            // Convert date strings back to Date objects
            if (value && typeof value === 'object') {
              if (value.createdAt) value.createdAt = new Date(value.createdAt);
              if (value.updatedAt) value.updatedAt = new Date(value.updatedAt);
            }
            this.store.set(key, value);
          });
        }
      }
    } catch (error) {
      console.error('Error loading data from file:', error);
      this.store = new Map<string, T>();
    }
  }

  /**
   * Save data to JSON file
   */
  private saveToFile(): void {
    try {
      // Convert Map to array of [key, value] pairs for JSON serialization
      const data = Array.from(this.store.entries());
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error saving data to file:', error);
    }
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
    this.saveToFile();
  }

  /**
   * Delete an item by ID
   * @returns true if item was deleted, false if not found
   */
  delete(id: string): boolean {
    const result = this.store.delete(id);
    if (result) {
      this.saveToFile();
    }
    return result;
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
    this.saveToFile();
  }
}
