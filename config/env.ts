/**
 * Environment configuration
 * Centralized place for all environment variables
 */

import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

// Load environment file based on NODE_ENV
const env = process.env.NODE_ENV || 'development';
const envFile = resolve(process.cwd(), `.env.${env}`);

// Load .env file if it exists and override existing values
if (existsSync(envFile)) {
  const content = readFileSync(envFile, 'utf-8');
  content.split('\n').forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;

    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');

      // Always override with environment-specific value
      process.env[key] = value;
    }
  });

  console.log(`✓ Loaded environment: ${env} (${envFile})`);
} else {
  console.warn(`⚠️  Environment file not found: ${envFile}`);
  console.warn(`   Using default or system environment variables`);
}

/**
 * Type-safe environment configuration
 */
export const config = {
  // Application
  nodeEnv: process.env.NODE_ENV || 'development',
  appName: process.env.APP_NAME || 'Nuxt4 App',
  appPort: parseInt(process.env.APP_PORT || '3000', 10),

  // API Server
  api: {
    port: parseInt(process.env.API_PORT || '3001', 10),
    host: process.env.API_HOST || 'localhost',
  },

  // Database
  database: {
    path: process.env.DATABASE_PATH || './sqlite.db',
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    accessTokenExpiry: process.env.JWT_ACCESS_TOKEN_EXPIRY || '15m',
    refreshTokenExpiryDays: parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRY_DAYS || '7', 10),
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },

  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',

  // Helper methods
  isDevelopment: () => process.env.NODE_ENV === 'development',
  isUAT: () => process.env.NODE_ENV === 'uat',
  isProduction: () => process.env.NODE_ENV === 'production',
  isTest: () => process.env.NODE_ENV === 'test',
} as const;

/**
 * Validate required environment variables
 */
export function validateEnv() {
  const required = ['JWT_SECRET'];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0 && config.isProduction()) {
    throw new Error(
      `Missing required environment variables in production: ${missing.join(', ')}`
    );
  }

  if (config.isProduction() && config.jwt.secret === 'your-secret-key-change-in-production') {
    console.warn('⚠️  WARNING: Using default JWT_SECRET in production! Please change it!');
  }
}

// Auto-validate on import
if (typeof process !== 'undefined') {
  try {
    validateEnv();
  } catch (error) {
    console.error('Environment validation failed:', error);
    if (config.isProduction()) {
      process.exit(1);
    }
  }
}
