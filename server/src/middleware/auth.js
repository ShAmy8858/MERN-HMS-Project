import createError from 'http-errors';
import jwt from 'jsonwebtoken';

import { config } from '../config/env.js';
import { User } from '../models/User.js';

export async function authenticate(req, _res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(createError(401, 'Authentication required'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(payload.sub);
    if (!user) {
      return next(createError(401, 'Invalid authentication token'));
    }
    req.user = user;
    return next();
  } catch (error) {
    return next(createError(401, 'Invalid or expired token'));
  }
}

export function requireRole(role) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(createError(401, 'Authentication required'));
    }
    if (req.user.role !== role) {
      return next(createError(403, 'Forbidden'));
    }
    return next();
  };
}
