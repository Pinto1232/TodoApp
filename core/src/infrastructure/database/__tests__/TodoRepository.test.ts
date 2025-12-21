import { TodoRepository } from '../../../infrastructure/database/TodoRepository';
import { Todo } from '../../../domain/entities/Todo';

describe('TodoRepository', () => {
  let repository: TodoRepository;

  beforeEach(() => {
    repository = new TodoRepository();
  });

  describe('initial state', () => {
    it('should be seeded with initial todos', () => {
      const todos = repository.findAll();

      expect(todos.length).toBeGreaterThan(0);
    });

    it('should have some completed and some incomplete todos', () => {
      const todos = repository.findAll();
      const completed = todos.filter((t) => t.completed);
      const incomplete = todos.filter((t) => !t.completed);

      expect(completed.length).toBeGreaterThan(0);
      expect(incomplete.length).toBeGreaterThan(0);
    });
  });

  describe('findAll', () => {
    it('should return all todos', () => {
      const todos = repository.findAll();

      expect(Array.isArray(todos)).toBe(true);
      todos.forEach((todo) => {
        expect(todo).toHaveProperty('id');
        expect(todo).toHaveProperty('text');
        expect(todo).toHaveProperty('completed');
        expect(todo).toHaveProperty('createdAt');
        expect(todo).toHaveProperty('updatedAt');
      });
    });
  });

  describe('findById', () => {
    it('should find a todo by id', () => {
      const todos = repository.findAll();
      const firstTodo = todos[0];

      const found = repository.findById(firstTodo.id);

      expect(found).toEqual(firstTodo);
    });

    it('should return undefined for non-existent id', () => {
      const found = repository.findById('non-existent-id');

      expect(found).toBeUndefined();
    });
  });

  describe('create', () => {
    it('should create a new todo', () => {
      const initialCount = repository.findAll().length;

      const newTodo = repository.create({ text: 'New test todo' });

      expect(newTodo).toBeDefined();
      expect(newTodo.id).toBeDefined();
      expect(newTodo.text).toBe('New test todo');
      expect(newTodo.completed).toBe(false);
      expect(repository.findAll().length).toBe(initialCount + 1);
    });

    it('should assign unique ids', () => {
      const todo1 = repository.create({ text: 'First' });
      const todo2 = repository.create({ text: 'Second' });

      expect(todo1.id).not.toBe(todo2.id);
    });

    it('should set timestamps on creation', () => {
      const before = new Date();
      const todo = repository.create({ text: 'Test' });
      const after = new Date();

      expect(todo.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(todo.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('should be retrievable after creation', () => {
      const created = repository.create({ text: 'Retrievable' });

      const found = repository.findById(created.id);

      expect(found).toEqual(created);
    });
  });

  describe('update', () => {
    it('should update todo text', () => {
      const todo = repository.create({ text: 'Original' });

      const updated = repository.update(todo.id, { text: 'Updated' });

      expect(updated).toBeDefined();
      expect(updated?.text).toBe('Updated');
      expect(updated?.id).toBe(todo.id);
    });

    it('should update completed status', () => {
      const todo = repository.create({ text: 'Test' });
      expect(todo.completed).toBe(false);

      const updated = repository.update(todo.id, { completed: true });

      expect(updated?.completed).toBe(true);
    });

    it('should update the updatedAt timestamp', () => {
      const todo = repository.create({ text: 'Test' });
      const originalUpdatedAt = todo.updatedAt;

      // Small delay to ensure different timestamp
      const updated = repository.update(todo.id, { text: 'Updated' });

      expect(updated?.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });

    it('should preserve other fields when updating', () => {
      const todo = repository.create({ text: 'Original' });
      const originalCreatedAt = todo.createdAt;

      const updated = repository.update(todo.id, { completed: true });

      expect(updated?.text).toBe('Original');
      expect(updated?.createdAt).toEqual(originalCreatedAt);
    });

    it('should return undefined for non-existent id', () => {
      const updated = repository.update('non-existent', { text: 'Test' });

      expect(updated).toBeUndefined();
    });

    it('should persist the update', () => {
      const todo = repository.create({ text: 'Original' });
      repository.update(todo.id, { text: 'Updated' });

      const found = repository.findById(todo.id);

      expect(found?.text).toBe('Updated');
    });
  });

  describe('delete', () => {
    it('should delete an existing todo', () => {
      const todo = repository.create({ text: 'To Delete' });

      const result = repository.delete(todo.id);

      expect(result).toBe(true);
      expect(repository.findById(todo.id)).toBeUndefined();
    });

    it('should return false for non-existent id', () => {
      const result = repository.delete('non-existent');

      expect(result).toBe(false);
    });

    it('should decrease the total count', () => {
      const todo = repository.create({ text: 'To Delete' });
      const countBefore = repository.findAll().length;

      repository.delete(todo.id);

      expect(repository.findAll().length).toBe(countBefore - 1);
    });
  });
});
