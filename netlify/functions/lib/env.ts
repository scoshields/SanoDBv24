import dotenv from 'dotenv';
dotenv.config();

// Environment variables for server context
export function getServerEnv(key: string): string {
  // Remove VITE_ prefix for server environment variables
  const serverKey = key.replace('VITE_', '');
  const value = process.env[serverKey];
  if (!value) {
    throw new Error(`Missing required environment variable: ${serverKey}`);
  }
  return value;
}