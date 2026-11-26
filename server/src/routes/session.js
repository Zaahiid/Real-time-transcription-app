import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';

import { ACCESS_CODE_PATTERN } from '../config.js';
import { HttpError } from '../lib/http-error.js';
import {
  SESSION_COOKIE,
  createSessionToken,
  isAuthenticated,
  isCorrectPassword,
  sessionCookieOptions,
} from '../lib/session.js';

const signInBody = z.object({
  password: z.string().regex(ACCESS_CODE_PATTERN, 'The access code must be six digits'),
});

const signInLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  message: { error: 'Too many attempts. Please try again in a few minutes.' },
});

export const sessionRouter = Router();

sessionRouter.get('/', (req, res) => {
  res.json({ authenticated: isAuthenticated(req) });
});

sessionRouter.post('/', signInLimiter, (req, res) => {
  const { password } = signInBody.parse(req.body);
  if (!isCorrectPassword(password)) throw new HttpError(401, 'Incorrect access code');

  res.cookie(SESSION_COOKIE, createSessionToken(), sessionCookieOptions).status(204).end();
});

sessionRouter.delete('/', (req, res) => {
  res.clearCookie(SESSION_COOKIE, sessionCookieOptions).status(204).end();
});
