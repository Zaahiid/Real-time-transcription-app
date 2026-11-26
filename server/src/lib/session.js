import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { parseCookie } from 'cookie';

import { config } from '../config.js';

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export const SESSION_COOKIE = 'session';

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: 'strict',
  secure: config.isProduction,
  maxAge: SESSION_DURATION_MS,
  path: '/',
};

export function isCorrectPassword(password) {
  return timingSafeEqual(sha256(password), sha256(config.accessPassword));
}

export function createSessionToken() {
  const expiresAt = String(Date.now() + SESSION_DURATION_MS);
  return `${expiresAt}.${sign(expiresAt)}`;
}

export function isAuthenticated(request) {
  const token = parseCookie(request.headers.cookie ?? '')[SESSION_COOKIE] ?? '';
  const [expiresAt, signature] = token.split('.');
  return Number(expiresAt) > Date.now() && safeEqual(signature, sign(expiresAt));
}

function sign(value) {
  return createHmac('sha256', config.sessionSecret).update(value).digest('base64url');
}

function sha256(value) {
  return createHash('sha256').update(value).digest();
}

function safeEqual(a = '', b = '') {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
