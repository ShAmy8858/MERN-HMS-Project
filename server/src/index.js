import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import createError from 'http-errors';

import { config } from './config/env.js';
import { connectDatabase } from './config/database.js';
import { logger } from './utils/logger.js';
import { authenticate, requireRole } from './middleware/auth.js';
import { ensureSeedAdmin } from './middleware/seedAdmin.js';
import { authRouter } from './routes/auth.js';
import { usersRouter } from './routes/users.js';
import { appointmentsRouter } from './routes/appointments.js';

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || config.corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  })
);
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/users', authenticate, requireRole('admin'), usersRouter);
app.use('/api/appointments', authenticate, appointmentsRouter);

app.use((req, _res, next) => {
  next(createError(404, `Route ${req.originalUrl} not found`));
});

app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  res.status(status).json({
    status,
    message: err.message || 'Internal server error'
  });
});

async function start() {
  await connectDatabase();
  await ensureSeedAdmin();
  app.listen(config.port, () => {
    logger.info(`Server listening on port ${config.port}`);
  });
}

start();
