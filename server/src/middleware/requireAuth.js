import { HttpError } from '../lib/http-error.js';
import { isAuthenticated } from '../lib/session.js';

export function requireAuth(req, res, next) {
  if (!isAuthenticated(req)) throw new HttpError(401, 'Please sign in to continue');
  next();
}
