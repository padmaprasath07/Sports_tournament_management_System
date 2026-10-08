import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from '../server/config/db.js';
import apiRoutes from '../server/routes/api.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Serverless DB connection middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('[Serverless DB Error]', err.message);
  }
  next();
});

// Mount API routes at both /api and / to handle different Vercel rewrite configurations
app.use('/api', apiRoutes);
app.use('/', apiRoutes);

// Root Welcome
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    project: 'SportPulse Sports Tournament Management Platform API (Serverless)',
    database: 'MongoDB Atlas'
  });
});

export default app;
