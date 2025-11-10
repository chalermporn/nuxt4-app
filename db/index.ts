import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import * as schema from './schema';
import { config } from '../config/env';

// Create SQLite database using environment-specific path
const sqlite = new Database(config.database.path, { create: true });

console.log(`📦 Database: ${config.database.path} (${config.nodeEnv})`);

// Create Drizzle instance
export const db = drizzle(sqlite, { schema });

// Export schema for easy access
export { schema };