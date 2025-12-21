import { v4 as uuidv4 } from 'uuid';

/**
 * Todo Entity
 *
 * Core business entity representing a Todo item.
 * This is a pure domain object with no external dependencies.
 *
 * Follows: Single Responsibility Principle (SRP)
 */
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO for creating a new Todo
 */
export interface CreateTodoDTO {
  text: string;
}

/**
 * Factory function to create a new Todo
 * Encapsulates the creation logic and ensures consistency
 */
export function createTodo(dto: CreateTodoDTO): Todo {
  const now = new Date();
  return {
    id: uuidv4(),
    text: dto.text,
    completed: false,
    createdAt: now,
    updatedAt: now,
  };
}
