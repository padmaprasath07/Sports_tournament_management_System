import mongoose from 'mongoose';
import dns from 'dns';

// Ensure reliable Atlas DNS resolution on local ISPs/Windows networks
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {}

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  const LOCAL_URI = 'mongodb://localhost:27017/sportpulse_db';
  const ATLAS_FALLBACK_URI = 'mongodb+srv://padmaprasath2007_db_user:aNcnfrCdAhWPDhvG@cluster0.aokpkbw.mongodb.net/test?retryWrites=true&w=majority';
  
  // Prefer Atlas if specified, or automatically in cloud environments (Render / Vercel / Production)
  const isCloudEnv = process.env.NODE_ENV === 'production' || Boolean(process.env.RENDER) || Boolean(process.env.VERCEL);
  const primaryUri = process.env.MONGODB_URI || process.env.ATLAS_URI || (isCloudEnv ? ATLAS_FALLBACK_URI : LOCAL_URI);

  try {
    const safeUri = primaryUri.includes('@') ? primaryUri.replace(/\/\/.*@/, '//***:***@') : primaryUri;
    console.log(`[Database] Connecting to MongoDB: ${safeUri}`);

    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 5000,
    });

    const isCloud = primaryUri.includes('mongodb+srv') || primaryUri.includes('.mongodb.net');
    console.log(`[Database] 🚀 MongoDB Connected Successfully: ${conn.connection.host} (${isCloud ? 'MongoDB Atlas Cloud' : 'Local MongoDB Compass (port 27017)'})`);

    mongoose.connection.on('error', (err) => {
      console.error(`[Database Error] Connection error: ${err.message}`);
    });

    return conn;
  } catch (err) {
    console.warn(`[Database] Primary connection failed: ${err.message}. Trying Atlas fallback...`);
    try {
      const fallbackUri = primaryUri.includes('mongodb.net') ? LOCAL_URI : ATLAS_FALLBACK_URI;
      const conn = await mongoose.connect(fallbackUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`[Database] 🚀 Fallback MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (fallbackErr) {
      console.error(`[Database Error] Both primary and fallback failed: ${fallbackErr.message}`);
      return null;
    }
  }
};
