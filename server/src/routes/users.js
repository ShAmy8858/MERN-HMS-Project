import bcrypt from 'bcryptjs';
import createError from 'http-errors';
import express from 'express';

import { User } from '../models/User.js';

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  const { name, email, password, role, department } = req.body;

  if (!name || !email || !password || !department) {
    return next(createError(400, 'Missing required fields'));
  }

  try {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return next(createError(409, 'User with that email already exists'));
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const normalizedRole = ['admin', 'manager', 'staff'].includes(String(role).toLowerCase())
      ? String(role).toLowerCase()
      : 'staff';
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      department,
      role: normalizedRole
    });

    res.status(201).json(user.toSafeJSON());
  } catch (error) {
    next(error);
  }
});

export { router as usersRouter };
