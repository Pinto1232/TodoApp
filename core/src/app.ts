import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { todoRoutes } from './presentation';

export const createApp = (): Application => {
  const app = express();

  // Middleware
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  // Routes
  app.use('/api/todos', todoRoutes);

  // 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ success: false, error: 'Route not found' });
  });

  return app;
};
