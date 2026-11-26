import path from 'node:path';

const rootDir = path.resolve(import.meta.dirname, '../..');

export const ACCESS_CODE_PATTERN = /^\d{6}$/;

export const config = {
  port: Number(process.env.PORT) || 3000,
  isProduction: process.env.NODE_ENV === 'production',
  clientDistDir: path.join(rootDir, 'client/dist'),
  databaseUrl: required('DATABASE_URL'),
  geminiApiKey: required('GEMINI_API_KEY'),
  geminiModel: process.env.GEMINI_MODEL || 'gemini-3.5-transcribe-live',
  accessPassword: accessCode(),
  sessionSecret: required('SESSION_SECRET'),
};

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function accessCode() {
  const code = required('ACCESS_PASSWORD');
  if (!ACCESS_CODE_PATTERN.test(code)) throw new Error('ACCESS_PASSWORD must be exactly six digits');
  return code;
}
