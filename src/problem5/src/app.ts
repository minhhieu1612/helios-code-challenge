import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import studentRoutes from './routes/studentRoutes';
import { swaggerSpec } from './swagger/swagger';
import { errorHandler } from './middlewares/errorHandler';

const app: Application = express();

// Core Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Swagger JSON Spec Endpoint
app.get('/api-docs.json', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// API Health Check
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    message: 'Welcome to Student CRUD Service API',
    swaggerDocs: '/api-docs',
    swaggerJson: '/api-docs.json',
  });
});

// Resource Routes
app.use('/api/students', studentRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
