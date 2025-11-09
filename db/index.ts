import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import * as schema from './schema';

// Create SQLite database
const sqlite = new Database('./sqlite.db', { create: true });

// Create Drizzle instance
export const db = drizzle(sqlite, { schema });

// Export schema for easy access
export { schema };
