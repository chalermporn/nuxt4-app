import { db } from '../db';
import { users, roles, permissions, rolePermissions } from '../db/schema';
import { hash } from 'bcrypt';
import { eq, or } from 'drizzle-orm';

const SALT_ROUNDS = 10;

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // 1. Seed Roles
    console.log('👥 Seeding roles...');

    // Delete existing roles to make script idempotent
    await db.delete(roles).where(
      or(
        eq(roles.name, 'admin'),
        eq(roles.name, 'moderator'),
        eq(roles.name, 'user')
      )
    );

    const [adminRole] = await db.insert(roles).values({
      name: 'admin',
      description: 'Administrator with full system access',
    }).returning();
    console.log('✅ Created admin role');

    const [moderatorRole] = await db.insert(roles).values({
      name: 'moderator',
      description: 'Moderator with limited management access',
    }).returning();
    console.log('✅ Created moderator role');

    const [userRole] = await db.insert(roles).values({
      name: 'user',
      description: 'Regular user with basic access',
    }).returning();
    console.log('✅ Created user role');

    // 2. Seed Permissions
    console.log('\n🔐 Seeding permissions...');

    const permissionsData = [
      // User permissions
      { name: 'users:create', description: 'Create new users', resource: 'users', action: 'create' },
      { name: 'users:read', description: 'View user details', resource: 'users', action: 'read' },
      { name: 'users:update', description: 'Update user information', resource: 'users', action: 'update' },
      { name: 'users:delete', description: 'Delete users', resource: 'users', action: 'delete' },
      { name: 'users:list', description: 'List all users', resource: 'users', action: 'list' },

      // Settings permissions
      { name: 'settings:read', description: 'View system settings', resource: 'settings', action: 'read' },
      { name: 'settings:update', description: 'Update system settings', resource: 'settings', action: 'update' },

      // Reports permissions
      { name: 'reports:read', description: 'View reports', resource: 'reports', action: 'read' },
      { name: 'reports:create', description: 'Create reports', resource: 'reports', action: 'create' },
    ];

    // Delete existing permissions
    for (const perm of permissionsData) {
      await db.delete(permissions).where(eq(permissions.name, perm.name));
    }

    const insertedPermissions = await db.insert(permissions).values(permissionsData).returning();
    console.log(`✅ Created ${insertedPermissions.length} permissions`);

    // Create permission map for easy lookup
    const permMap = new Map(insertedPermissions.map(p => [p.name, p.id]));

    // 3. Assign Permissions to Roles
    console.log('\n🔗 Assigning permissions to roles...');

    // Delete existing role-permission relationships
    await db.delete(rolePermissions);

    // Admin gets all permissions
    const adminPermissions = insertedPermissions.map(p => ({
      roleId: adminRole.id,
      permissionId: p.id,
    }));
    await db.insert(rolePermissions).values(adminPermissions);
    console.log(`✅ Assigned ${adminPermissions.length} permissions to admin role`);

    // Moderator gets read and list permissions for users
    const moderatorPerms = [
      { roleId: moderatorRole.id, permissionId: permMap.get('users:read')! },
      { roleId: moderatorRole.id, permissionId: permMap.get('users:list')! },
      { roleId: moderatorRole.id, permissionId: permMap.get('reports:read')! },
    ];
    await db.insert(rolePermissions).values(moderatorPerms);
    console.log(`✅ Assigned ${moderatorPerms.length} permissions to moderator role`);

    // User gets basic permissions
    const userPerms = [
      { roleId: userRole.id, permissionId: permMap.get('reports:read')! },
    ];
    await db.insert(rolePermissions).values(userPerms);
    console.log(`✅ Assigned ${userPerms.length} permissions to user role`);

    // 4. Seed Users
    console.log('\n👤 Seeding users...');

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

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Roles: ${[adminRole, moderatorRole, userRole].length}`);
    console.log(`   - Permissions: ${insertedPermissions.length}`);
    console.log(`   - Users: 3`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
