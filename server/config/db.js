import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB Notice] Database connection deferred (${error.message}).`);
    console.warn(`[MongoDB Notice] Server is running. To enable database persistence, provide a MONGO_URI (e.g. MongoDB Atlas or local mongod).`);
  }
};
