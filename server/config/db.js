import mongoose from 'mongoose';
import dns from 'dns';

// Ensure reliable Atlas DNS resolution on local Windows networks while preserving cloud DNS
try {
  if (process.platform === 'win32' && !process.env.VERCEL && !process.env.RENDER) {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  }
} catch {}

let cachedConnection = null;

export const connectDB = async () => {
  if (cachedConnection && mongoose.connection.readyState >= 1) {
    return cachedConnection;
  }

  const ATLAS_FALLBACK_URI = 'mongodb+srv://padmaprasath2007_db_user:aNcnfrCdAhWPDhvG@cluster0.aokpkbw.mongodb.net/test?retryWrites=true&w=majority';
  const primaryUri = process.env.MONGODB_URI || process.env.ATLAS_URI || ATLAS_FALLBACK_URI;

  try {
    const safeUri = primaryUri.includes('@') ? primaryUri.replace(/\/\/.*@/, '//***:***@') : primaryUri;
    console.log(`[Database] Connecting to MongoDB: ${safeUri}`);

    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 5000,
    });

    cachedConnection = conn;
    const isCloud = primaryUri.includes('mongodb+srv') || primaryUri.includes('.mongodb.net');
    console.log(`[Database] 🚀 MongoDB Connected Successfully: ${conn.connection.host} (${isCloud ? 'MongoDB Atlas Cloud' : 'Local MongoDB Compass'})`);

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
