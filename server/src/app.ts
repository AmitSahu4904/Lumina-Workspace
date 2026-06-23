import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'express-async-errors'; // Handles async controller errors automatically

import env from './config/env';
import authRouter from './routes/auth.routes';
import projectRouter from './routes/project.routes';
import taskRouter from './routes/task.routes';
import profileRouter from './routes/profile.routes';
import userRouter from './routes/user.routes';
import { errorHandler } from './middleware/error.middleware';
import { error } from './utils/response';

const app = express();

// Standard Global Security and Logging Middleware
app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());

if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health Check Endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'OK', env: env.NODE_ENV });
});

// Routing Mounts
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/projects', projectRouter);
app.use('/api/v1/tasks', taskRouter);
app.use('/api/v1/profile', profileRouter);
app.use('/api/v1/users', userRouter);

// 404 Route handler
app.use('*', (req, res) => {
  return error(res, `Route ${req.baseUrl} not found`, 404);
});

// Global Error Handler Middleware
app.use(errorHandler);

export { app };
export default app;
