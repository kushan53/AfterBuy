import mongoose from 'mongoose';

// Disable command buffering so Mongoose never freezes requests when disconnected
mongoose.set('bufferCommands', false);
mongoose.set('bufferTimeoutMS', 1500);

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
      serverSelectionTimeoutMS: 2500, // Fast 2.5s timeout to prevent request freezing
      connectTimeoutMS: 2500,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB Connection Notice] Atlas unreachable (${error.message}). Running in resilient local storage mode.`);
  } finally {
    isConnecting = false;
  }
};

export const ensureDBConnected = async (timeoutMs = 1500) => {
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
