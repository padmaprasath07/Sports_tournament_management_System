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

  const ATLAS_FALLBACK_URI = 'mongodb+srv://padmaprasath2007_db_user:aNcnfrCdAhWPDhvG@cluster0.aokpkbw.mongodb.net/test?retryWrites=true&w=majority';
  const uriToConnect = process.env.MONGODB_URI || ATLAS_FALLBACK_URI;

  try {
    
    // Mask credentials for safe console logging
    const safeUri = uriToConnect.includes('@') 
      ? uriToConnect.replace(/\/\/.*@/, '//***:***@') 
      : uriToConnect;

    console.log(`[Database] Connecting to MongoDB: ${safeUri}`);

    const conn = await mongoose.connect(uriToConnect, {
      serverSelectionTimeoutMS: 3000,
    });

    const isCloud = uriToConnect.includes('mongodb+srv') || uriToConnect.includes('.mongodb.net');
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
