import { Router, Request, Response } from 'express';
import { GetTodosUseCase, CreateTodoUseCase } from '../../application';
import { TodoRepository } from '../../infrastructure/database';

/**
 * Todo Routes
 * 
 * Presentation layer - HTTP routes for Todo API.
 * 
 * Follows: Single Responsibility Principle (SRP)
 */
const router = Router();

// Initialize repository and use cases
const todoRepository = new TodoRepository();
const getTodosUseCase = new GetTodosUseCase(todoRepository);
const createTodoUseCase = new CreateTodoUseCase(todoRepository);

/**
 * GET /api/todos
 * Get all todos
 */
router.get('/', (_req: Request, res: Response) => {
  try {
    const todos = getTodosUseCase.execute();
    res.status(200).json({
      success: true,
      data: todos,
      count: todos.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch todos',
    });
  }
});

/**
 * POST /api/todos
 * Create a new todo
 */
router.post('/', (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'Text is required',
      });
    }

    const todo = createTodoUseCase.execute({ text });
    res.status(201).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create todo';
    res.status(400).json({
      success: false,
      error: message,
    });
  }
});

export const todoRoutes = router;
