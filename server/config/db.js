import mongoose from 'mongoose';

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri && (process.env.VERCEL || process.env.NODE_ENV === 'production')) {
    console.warn('[Database Notice] MONGODB_URI environment variable is not configured on Vercel.');
    return null;
  }

  try {
    const uriToConnect = mongoUri || 'mongodb://localhost:27017/sportpulse_db';
    
    // Mask credentials for safe console logging
    const safeUri = uriToConnect.includes('@') 
      ? uriToConnect.replace(/\/\/.*@/, '//***:***@') 
      : uriToConnect;

    console.log(`[Database] Connecting to MongoDB: ${safeUri}`);

    const conn = await mongoose.connect(uriToConnect, {
      serverSelectionTimeoutMS: 3000,
    });

    const isCloud = mongoUri.includes('mongodb+srv') || mongoUri.includes('.mongodb.net');
    console.log(`[Database] 🚀 MongoDB Connected Successfully: ${conn.connection.host} (${isCloud ? 'MongoDB Atlas Cloud' : 'Local MongoDB'})`);

    mongoose.connection.on('error', (err) => {
      console.error(`[Database Error] Connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[Database Warning] MongoDB disconnected. Attempting reconnection...');
    });

    return conn;
  } catch (error) {
    console.error(`[Database Error] Failed to connect to MongoDB: ${error.message}`);
    console.warn('[Database] Starting in offline fallback mode. Database-dependent endpoints will return informative fallback messages.');
    return null;
  }
};
