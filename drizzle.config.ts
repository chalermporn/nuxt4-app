import { defineConfig } from 'drizzle-kit';
import { config } from './config/env';

export default defineConfig({
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: config.database.path,
  },
  verbose: true,
  strict: true,
});
