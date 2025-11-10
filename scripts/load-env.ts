/**
 * Load environment variables based on NODE_ENV
 * Usage: bun run scripts/load-env.ts
 */

import { existsSync } from 'fs';
import { resolve } from 'path';

// Get environment from NODE_ENV or default to 'development'
const env = process.env.NODE_ENV || 'development';

// Construct env file path
const envFile = resolve(process.cwd(), `.env.${env}`);

// Check if env file exists
if (!existsSync(envFile)) {
  console.warn(`⚠️  Warning: Environment file not found: ${envFile}`);
  console.warn(`   Falling back to .env.development or .env.example`);

  // Try fallback files
  const fallbackFiles = [
    resolve(process.cwd(), '.env.development'),
    resolve(process.cwd(), '.env.example'),
  ];

  let loaded = false;
  for (const fallback of fallbackFiles) {
    if (existsSync(fallback)) {
      console.log(`✓  Loading fallback: ${fallback}`);
      process.env.ENV_FILE = fallback;
      loaded = true;
      break;
    }
  }

  if (!loaded) {
    console.error('❌  No environment files found!');
    process.exit(1);
  }
} else {
  console.log(`✓  Loading environment: ${env}`);
  console.log(`   File: ${envFile}`);
  process.env.ENV_FILE = envFile;
}

// Load the env file using Bun's built-in support
if (process.env.ENV_FILE) {
  // Bun automatically loads .env files, but we need to explicitly load our specific env file
  const file = Bun.file(process.env.ENV_FILE);
  const content = await file.text();

  // Parse and set environment variables
  content.split('\n').forEach(line => {
    line = line.trim();

    // Skip empty lines and comments
    if (!line || line.startsWith('#')) return;

    // Parse KEY=VALUE
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, ''); // Remove quotes

      // Only set if not already set (allow override from system env)
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });

  console.log(`✓  Environment loaded successfully\n`);
}

export {};
