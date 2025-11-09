import { db } from '../db';
import { users } from '../db/schema';
import { hash } from 'bcrypt';
import { eq, or } from 'drizzle-orm';

const SALT_ROUNDS = 10;

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Delete existing seed users to make script idempotent
    await db.delete(users).where(
      or(
        eq(users.email, 'admin@example.com'),
        eq(users.email, 'mod@example.com'),
        eq(users.email, 'user@example.com')
      )
    );
    console.log('🧹 Cleaned up existing seed users');

    // Create admin user
    const adminPassword = await hash('admin123', SALT_ROUNDS);
    await db.insert(users).values({
      email: 'admin@example.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'admin',
    });
    console.log('✅ Created admin user (admin@example.com / admin123)');

    // Create moderator user
    const moderatorPassword = await hash('mod123', SALT_ROUNDS);
    await db.insert(users).values({
      email: 'mod@example.com',
      password: moderatorPassword,
      name: 'Moderator User',
      role: 'moderator',
    });
    console.log('✅ Created moderator user (mod@example.com / mod123)');

    // Create regular user
    const userPassword = await hash('user123', SALT_ROUNDS);
    await db.insert(users).values({
      email: 'user@example.com',
      password: userPassword,
      name: 'Regular User',
      role: 'user',
    });
    console.log('✅ Created regular user (user@example.com / user123)');

    console.log('🎉 Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
