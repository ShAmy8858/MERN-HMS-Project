import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 4000,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pulsecare',
  jwtSecret: process.env.JWT_SECRET || 'development-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '2h'
};
