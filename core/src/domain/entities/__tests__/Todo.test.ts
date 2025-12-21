import { createTodo, Todo, CreateTodoDTO } from '../../../domain/entities/Todo';

describe('Todo Entity', () => {
  describe('createTodo', () => {
    it('should create a todo with valid data', () => {
      const dto: CreateTodoDTO = { text: 'Test todo' };
      const todo = createTodo(dto);

      expect(todo).toBeDefined();
      expect(todo.id).toBeDefined();
      expect(todo.text).toBe('Test todo');
      expect(todo.completed).toBe(false);
      expect(todo.createdAt).toBeInstanceOf(Date);
      expect(todo.updatedAt).toBeInstanceOf(Date);
    });

    it('should create unique ids for different todos', () => {
      const dto1: CreateTodoDTO = { text: 'First todo' };
      const dto2: CreateTodoDTO = { text: 'Second todo' };

      const todo1 = createTodo(dto1);
      const todo2 = createTodo(dto2);

      expect(todo1.id).not.toBe(todo2.id);
    });

    it('should set completed to false by default', () => {
      const dto: CreateTodoDTO = { text: 'Test todo' };
      const todo = createTodo(dto);

      expect(todo.completed).toBe(false);
    });

    it('should set createdAt and updatedAt to current time', () => {
      const before = new Date();
      const dto: CreateTodoDTO = { text: 'Test todo' };
      const todo = createTodo(dto);
      const after = new Date();

      expect(todo.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(todo.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
      expect(todo.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(todo.updatedAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('should preserve the exact text provided', () => {
      const texts = [
        'Simple text',
        '  Text with spaces  ',
        'Text with special chars: @#$%^&*()',
        'Multi\nline\ntext',
        '',
      ];

      texts.forEach((text) => {
        const todo = createTodo({ text });
        expect(todo.text).toBe(text);
      });
    });
  });

  describe('Todo interface', () => {
    it('should accept valid Todo objects', () => {
      const todo: Todo = {
        id: 'test-id',
        text: 'Test todo',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(todo.id).toBe('test-id');
      expect(todo.text).toBe('Test todo');
      expect(todo.completed).toBe(false);
    });

    it('should allow completed to be true', () => {
      const todo: Todo = {
        id: 'test-id',
        text: 'Completed todo',
        completed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(todo.completed).toBe(true);
    });
  });
});
