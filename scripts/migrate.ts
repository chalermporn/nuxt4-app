/**
 * Database migration script
 * Auto-creates tables if they don't exist
 */

import { db } from '../db';
import { users, refreshTokens, roles, permissions, rolePermissions } from '../db/schema';
import { sql } from 'drizzle-orm';
import { config } from '../config/env';

async function migrate() {
  console.log(`\n🔄 Running migrations for ${config.nodeEnv} environment...`);
  console.log(`   Database: ${config.database.path}\n`);

  try {
    // Check if tables exist by trying to count
    const tablesToCheck = [
      { name: 'users', table: users },
      { name: 'refresh_tokens', table: refreshTokens },
      { name: 'roles', table: roles },
      { name: 'permissions', table: permissions },
      { name: 'role_permissions', table: rolePermissions },
    ];

    for (const { name, table } of tablesToCheck) {
      try {
        await db.select().from(table).limit(1);
        console.log(`✅ ${name} table exists`);
      } catch {
        console.log(`⚠️  ${name} table does not exist, will be created`);
      }
    }

    // Create tables using raw SQL if needed
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT DEFAULT 'user' NOT NULL,
        created_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL,
        updated_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        user_id INTEGER NOT NULL,
        token TEXT NOT NULL UNIQUE,
        expires_at INTEGER NOT NULL,
        created_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS roles (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        created_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL,
        updated_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS permissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        resource TEXT NOT NULL,
        action TEXT NOT NULL,
        created_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS role_permissions (
        role_id INTEGER NOT NULL,
        permission_id INTEGER NOT NULL,
        created_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL,
        PRIMARY KEY (role_id, permission_id),
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
        FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
      )
    `);

    // Create indexes
    await db.run(sql`
      CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users(email)
    `);

    await db.run(sql`
      CREATE UNIQUE INDEX IF NOT EXISTS refresh_tokens_token_unique ON refresh_tokens(token)
    `);

    await db.run(sql`
      CREATE UNIQUE INDEX IF NOT EXISTS roles_name_unique ON roles(name)
    `);

    await db.run(sql`
      CREATE UNIQUE INDEX IF NOT EXISTS permissions_name_unique ON permissions(name)
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
