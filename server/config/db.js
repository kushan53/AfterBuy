import mongoose from 'mongoose';

let isConnecting = false;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  if (isConnecting) return;

  isConnecting = true;
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.warn('[MongoDB Notice] No MONGO_URI specified in environment variables.');
      return;
    }

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000, // 15 seconds for robust DNS SRV & TLS on Atlas
      connectTimeoutMS: 15000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Connection Notice] Connection deferred (${error.message}).`);
    console.warn(`[MongoDB Hint] If using MongoDB Atlas, please check if your current IP is whitelisted (or add 0.0.0.0/0 in Atlas Network Access).`);
  } finally {
    isConnecting = false;
  }
};

export const ensureDBConnected = async (timeoutMs = 4000) => {
  if (mongoose.connection.readyState === 1) return true;
  try {
    const connectPromise = connectDB();
    const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(false), timeoutMs));
    await Promise.race([connectPromise, timeoutPromise]);
    return mongoose.connection.readyState === 1;
  } catch {
    return false;
  }
};

// Reconnect automatically if connection drops
mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB Notice] Connection lost. Attempting to reconnect in 5 seconds...');
  setTimeout(() => {
    connectDB();
  }, 5000);
});
