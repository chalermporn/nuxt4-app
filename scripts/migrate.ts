/**
 * Database migration script
 * Auto-creates tables if they don't exist
 */

import { db } from '../db';
import { users, refreshTokens } from '../db/schema';
import { sql } from 'drizzle-orm';
import { config } from '../config/env';

async function migrate() {
  console.log(`\n🔄 Running migrations for ${config.nodeEnv} environment...`);
  console.log(`   Database: ${config.database.path}\n`);

  try {
    // Check if tables exist by trying to count
    try {
      await db.select().from(users).limit(1);
      console.log('✅ Users table exists');
    } catch {
      console.log('⚠️  Users table does not exist, will be created');
    }

    try {
      await db.select().from(refreshTokens).limit(1);
      console.log('✅ Refresh tokens table exists');
    } catch {
      console.log('⚠️  Refresh tokens table does not exist, will be created');
    }

    // Create tables using raw SQL if needed
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT DEFAULT 'user' NOT NULL,
        created_at INTEGER DEFAULT (unixepoch()) NOT NULL,
        updated_at INTEGER DEFAULT (unixepoch()) NOT NULL
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        user_id INTEGER NOT NULL,
        token TEXT NOT NULL UNIQUE,
        expires_at INTEGER NOT NULL,
        created_at INTEGER DEFAULT (unixepoch()) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create indexes
    await db.run(sql`
      CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users(email)
    `);

    await db.run(sql`
      CREATE UNIQUE INDEX IF NOT EXISTS refresh_tokens_token_unique ON refresh_tokens(token)
    `);

    console.log('\n✅ Migration completed successfully!');
    console.log(`   Tables are ready in: ${config.database.path}\n`);
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrate();
