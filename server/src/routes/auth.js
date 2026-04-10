import bcrypt from 'bcryptjs';
import createError from 'http-errors';
import express from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../config/env.js';
import { User } from '../models/User.js';

const router = express.Router();
const PUBLIC_SIGNUP_ROLES = new Set(['admin', 'manager']);

function signToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
      department: user.department
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(createError(400, 'Email and password are required'));
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return next(createError(401, 'Invalid email or password'));
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return next(createError(401, 'Invalid email or password'));
    }

    const token = signToken(user);
    return res.json({
      token,
      user: user.toSafeJSON()
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/signup', async (req, res, next) => {
  const { name, email, password, department, role } = req.body;

  if (!name || !email || !password || !department || !role) {
    return next(createError(400, 'All fields are required'));
  }

  const normalizedRole = String(role).toLowerCase();
  if (!PUBLIC_SIGNUP_ROLES.has(normalizedRole)) {
    return next(createError(400, 'You can only sign up as an admin or hospital manager'));
  }

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return next(createError(409, 'User with that email already exists'));
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: normalizedRole,
      department
    });

    const token = signToken(user);
    return res.status(201).json({
      token,
      user: user.toSafeJSON()
    });
  } catch (error) {
    return next(error);
  }
});

export { router as authRouter };
