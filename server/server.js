import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import apiRoutes from './routes/api.js';
import { seedDatabase } from './seed/seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration (allow Vite client during development and production domains)
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(morgan('dev'));

// Mount API routes
app.use('/api', apiRoutes);

// Root Welcome Endpoint
app.get('/', (req, res) => {
  res.json({
    project: 'SportPulse Sports Tournament Management Platform API',
    database: 'MongoDB (Mongoose ODM)',
    version: '1.0.0',
    documentation: '/api/health',
    status: 'online',
  });
});

// Fallback 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route not found: ${req.originalUrl}` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack || err.message);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

// Initialize Database and Start Server
const startServer = async () => {
  try {
    const conn = await connectDB();
    if (conn) {
      // Auto seed initial data if collections are empty
      await seedDatabase(false);
    }

    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🏆 SportPulse API Server Running on port ${PORT}`);
      console.log(`📡 Health & DB Status: http://localhost:${PORT}/api/health`);
      console.log(`🏅 Tournaments API:    http://localhost:${PORT}/api/tournaments`);
      console.log(`=======================================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
