import mongoose from 'mongoose';

import { config } from './env.js';
import { logger } from '../utils/logger.js';

export async function connectDatabase() {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(config.mongodbUri, {
      autoIndex: true
    });
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}
