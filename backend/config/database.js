import mongoose from 'mongoose';
import logger from './logger.js';

const connectDB = async () => {
  try {
    logger.info('Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    const message = `✅ MongoDB Connected: ${conn.connection.host}`;
    console.log(message);
    logger.info(message);
    logger.info(`Database: ${conn.connection.name}`);
  } catch (error) {
    const errorMessage = `❌ MongoDB Connection Error: ${error.message}`;
    console.error(errorMessage);
    logger.error(errorMessage, { stack: error.stack });
    process.exit(1);
  }
};

export default connectDB;
