/**
 * Permissions Repository Test Suite
 */

import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import { db } from '../../db';
import { roles, permissions, rolePermissions } from '../../db/schema';
import { eq } from 'drizzle-orm';
import {
  getRolePermissions,
  hasPermission,
  hasResourcePermission,
  getAllRoles,
  getRoleByName,
  getAllPermissions,
  getPermissionByName,
  assignPermissionToRole,
  removePermissionFromRole,
  getRoleWithPermissions,
} from './permissions';

describe('Permissions Repository', () => {
  // Setup test data
  beforeAll(async () => {
    // Clean up existing test data
    await db.delete(rolePermissions);
    await db.delete(permissions);
    await db.delete(roles);

    // Create test roles
    const [adminRole] = await db.insert(roles).values({
      name: 'test_admin',
      description: 'Test admin role',
    }).returning();

    const [userRole] = await db.insert(roles).values({
      name: 'test_user',
      description: 'Test user role',
    }).returning();

    // Create test permissions
    const testPermissions = await db.insert(permissions).values([
      {
        name: 'test:create',
        description: 'Create test resources',
        resource: 'test',
        action: 'create',
      },
      {
        name: 'test:read',
        description: 'Read test resources',
        resource: 'test',
        action: 'read',
      },
      {
        name: 'test:update',
        description: 'Update test resources',
        resource: 'test',
        action: 'update',
      },
      {
        name: 'test:delete',
        description: 'Delete test resources',
        resource: 'test',
        action: 'delete',
      },
    ]).returning();

    // Assign all permissions to admin
    await db.insert(rolePermissions).values(
      testPermissions.map((perm) => ({
        roleId: adminRole.id,
        permissionId: perm.id,
      }))
    );

    // Assign only read permission to user
    const readPerm = testPermissions.find((p) => p.name === 'test:read')!;
    await db.insert(rolePermissions).values({
      roleId: userRole.id,
      permissionId: readPerm.id,
    });
  });

  // Cleanup after all tests
  afterAll(async () => {
    await db.delete(rolePermissions);
    await db.delete(permissions);
    await db.delete(roles);
  });

  describe('getRolePermissions', () => {
    it('should return all permissions for admin role', async () => {
      const perms = await getRolePermissions('test_admin');
      expect(perms).toHaveLength(4);
      expect(perms.map((p) => p.name).sort()).toEqual([
        'test:create',
        'test:delete',
        'test:read',
        'test:update',
      ]);
    });

    it('should return only read permission for user role', async () => {
      const perms = await getRolePermissions('test_user');
      expect(perms).toHaveLength(1);
      expect(perms[0].name).toBe('test:read');
    });

    it('should return empty array for non-existent role', async () => {
      const perms = await getRolePermissions('non_existent');
      expect(perms).toHaveLength(0);
    });
  });

  describe('hasPermission', () => {
    it('should return true when admin has create permission', async () => {
      const result = await hasPermission('test_admin', 'test:create');
      expect(result).toBe(true);
    });

    it('should return false when user does not have create permission', async () => {
      const result = await hasPermission('test_user', 'test:create');
      expect(result).toBe(false);
    });

    it('should return true when user has read permission', async () => {
      const result = await hasPermission('test_user', 'test:read');
      expect(result).toBe(true);
    });

    it('should return false for non-existent permission', async () => {
      const result = await hasPermission('test_admin', 'test:nonexistent');
      expect(result).toBe(false);
    });

    it('should return false for non-existent role', async () => {
      const result = await hasPermission('non_existent', 'test:read');
      expect(result).toBe(false);
    });
  });

  describe('hasResourcePermission', () => {
    it('should return true when admin has permission for resource:action', async () => {
      const result = await hasResourcePermission('test_admin', 'test', 'create');
      expect(result).toBe(true);
    });

    it('should return false when user does not have permission for resource:action', async () => {
      const result = await hasResourcePermission('test_user', 'test', 'delete');
      expect(result).toBe(false);
    });

    it('should return true when user has read permission for resource', async () => {
      const result = await hasResourcePermission('test_user', 'test', 'read');
      expect(result).toBe(true);
    });

    it('should return false for non-existent resource', async () => {
      const result = await hasResourcePermission('test_admin', 'nonexistent', 'read');
      expect(result).toBe(false);
    });
  });

  describe('getAllRoles', () => {
    it('should return all roles', async () => {
      const allRoles = await getAllRoles();
      expect(allRoles.length).toBeGreaterThanOrEqual(2);
      const roleNames = allRoles.map((r) => r.name);
      expect(roleNames).toContain('test_admin');
      expect(roleNames).toContain('test_user');
    });
  });

  describe('getRoleByName', () => {
    it('should return role when it exists', async () => {
      const role = await getRoleByName('test_admin');
      expect(role).not.toBeNull();
      expect(role?.name).toBe('test_admin');
      expect(role?.description).toBe('Test admin role');
    });

    it('should return null for non-existent role', async () => {
      const role = await getRoleByName('non_existent');
      expect(role).toBeNull();
    });
  });

  describe('getAllPermissions', () => {
    it('should return all permissions', async () => {
      const allPerms = await getAllPermissions();
      expect(allPerms.length).toBeGreaterThanOrEqual(4);
      const permNames = allPerms.map((p) => p.name);
      expect(permNames).toContain('test:create');
      expect(permNames).toContain('test:read');
    });
  });

  describe('getPermissionByName', () => {
    it('should return permission when it exists', async () => {
      const perm = await getPermissionByName('test:read');
      expect(perm).not.toBeNull();
      expect(perm?.name).toBe('test:read');
      expect(perm?.resource).toBe('test');
      expect(perm?.action).toBe('read');
    });

    it('should return null for non-existent permission', async () => {
      const perm = await getPermissionByName('non_existent');
      expect(perm).toBeNull();
    });
  });

  describe('assignPermissionToRole', () => {
    it('should assign permission to role successfully', async () => {
      const result = await assignPermissionToRole('test_user', 'test:create');
      expect(result.message).toContain('successfully');

      // Verify the permission was assigned
      const hasAccess = await hasPermission('test_user', 'test:create');
      expect(hasAccess).toBe(true);

      // Cleanup - remove the permission
      await removePermissionFromRole('test_user', 'test:create');
    });

    it('should return message when permission already assigned', async () => {
      const result = await assignPermissionToRole('test_user', 'test:read');
      expect(result.message).toContain('already assigned');
    });

    it('should throw error for non-existent role', async () => {
      expect(async () => {
        await assignPermissionToRole('non_existent', 'test:read');
      }).toThrow('Role \'non_existent\' not found');
    });

    it('should throw error for non-existent permission', async () => {
      expect(async () => {
        await assignPermissionToRole('test_user', 'non_existent');
      }).toThrow('Permission \'non_existent\' not found');
    });
  });

  describe('removePermissionFromRole', () => {
    it('should remove permission from role successfully', async () => {
      // First assign a permission
      await assignPermissionToRole('test_user', 'test:update');
      expect(await hasPermission('test_user', 'test:update')).toBe(true);

      // Remove it
      const result = await removePermissionFromRole('test_user', 'test:update');
      expect(result.message).toContain('removed');

      // Verify it was removed
      const hasAccess = await hasPermission('test_user', 'test:update');
      expect(hasAccess).toBe(false);
    });

    it('should throw error for non-existent role', async () => {
      expect(async () => {
        await removePermissionFromRole('non_existent', 'test:read');
      }).toThrow('Role \'non_existent\' not found');
    });

    it('should throw error for non-existent permission', async () => {
      expect(async () => {
        await removePermissionFromRole('test_user', 'non_existent');
      }).toThrow('Permission \'non_existent\' not found');
    });
  });

  describe('getRoleWithPermissions', () => {
    it('should return role with all its permissions', async () => {
      const roleWithPerms = await getRoleWithPermissions('test_admin');
      expect(roleWithPerms).not.toBeNull();
      expect(roleWithPerms?.name).toBe('test_admin');
      expect(roleWithPerms?.permissions).toHaveLength(4);
      expect(roleWithPerms?.permissions.map((p) => p.name).sort()).toEqual([
        'test:create',
        'test:delete',
        'test:read',
        'test:update',
      ]);
    });

    it('should return role with single permission', async () => {
      const roleWithPerms = await getRoleWithPermissions('test_user');
      expect(roleWithPerms).not.toBeNull();
      expect(roleWithPerms?.permissions).toHaveLength(1);
      expect(roleWithPerms?.permissions[0].name).toBe('test:read');
    });

    it('should return null for non-existent role', async () => {
      const roleWithPerms = await getRoleWithPermissions('non_existent');
      expect(roleWithPerms).toBeNull();
    });
  });

  describe('Permission structure validation', () => {
    it('should have correct permission structure', async () => {
      const perm = await getPermissionByName('test:create');
      expect(perm).toHaveProperty('id');
      expect(perm).toHaveProperty('name');
      expect(perm).toHaveProperty('description');
      expect(perm).toHaveProperty('resource');
      expect(perm).toHaveProperty('action');
      expect(perm).toHaveProperty('createdAt');
    });

    it('should have correct role structure', async () => {
      const role = await getRoleByName('test_admin');
      expect(role).toHaveProperty('id');
      expect(role).toHaveProperty('name');
      expect(role).toHaveProperty('description');
      expect(role).toHaveProperty('createdAt');
      expect(role).toHaveProperty('updatedAt');
    });
  });

  describe('Multiple permissions operations', () => {
    it('should correctly handle role with no permissions', async () => {
      // Create a role with no permissions
      const [emptyRole] = await db.insert(roles).values({
        name: 'test_empty',
        description: 'Empty role',
      }).returning();

      const perms = await getRolePermissions('test_empty');
      expect(perms).toHaveLength(0);

      const roleWithPerms = await getRoleWithPermissions('test_empty');
      expect(roleWithPerms?.permissions).toHaveLength(0);

      // Cleanup
      await db.delete(roles).where(eq(roles.name, 'test_empty'));
    });

    it('should handle multiple permission assignments in sequence', async () => {
      await assignPermissionToRole('test_user', 'test:update');
      await assignPermissionToRole('test_user', 'test:delete');

      const perms = await getRolePermissions('test_user');
      expect(perms.length).toBeGreaterThanOrEqual(3); // read + update + delete

      // Cleanup
      await removePermissionFromRole('test_user', 'test:update');
      await removePermissionFromRole('test_user', 'test:delete');
    });
  });
});
