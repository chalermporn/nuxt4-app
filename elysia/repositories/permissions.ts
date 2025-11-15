/**
 * Permissions Repository
 * Handles RBAC (Role-Based Access Control) operations
 */

import { db } from '../../db';
import { roles, permissions, rolePermissions } from '../../db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * Get all permissions for a specific role
 */
export async function getRolePermissions(roleName: string) {
  const result = await db
    .select({
      permission: permissions,
    })
    .from(roles)
    .innerJoin(rolePermissions, eq(roles.id, rolePermissions.roleId))
    .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .where(eq(roles.name, roleName));

  return result.map((r) => r.permission);
}

/**
 * Check if a role has a specific permission
 */
export async function hasPermission(roleName: string, permissionName: string): Promise<boolean> {
  const result = await db
    .select({
      id: permissions.id,
    })
    .from(roles)
    .innerJoin(rolePermissions, eq(roles.id, rolePermissions.roleId))
    .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .where(and(eq(roles.name, roleName), eq(permissions.name, permissionName)))
    .limit(1);

  return result.length > 0;
}

/**
 * Check if a role has permission for a specific resource:action
 */
export async function hasResourcePermission(
  roleName: string,
  resource: string,
  action: string
): Promise<boolean> {
  const result = await db
    .select({
      id: permissions.id,
    })
    .from(roles)
    .innerJoin(rolePermissions, eq(roles.id, rolePermissions.roleId))
    .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .where(
      and(
        eq(roles.name, roleName),
        eq(permissions.resource, resource),
        eq(permissions.action, action)
      )
    )
    .limit(1);

  return result.length > 0;
}

/**
 * Get all roles
 */
export async function getAllRoles() {
  return await db.select().from(roles);
}

/**
 * Get a role by name
 */
export async function getRoleByName(name: string) {
  const result = await db.select().from(roles).where(eq(roles.name, name)).limit(1);
  return result[0] || null;
}

/**
 * Get all permissions
 */
export async function getAllPermissions() {
  return await db.select().from(permissions);
}

/**
 * Get a permission by name
 */
export async function getPermissionByName(name: string) {
  const result = await db.select().from(permissions).where(eq(permissions.name, name)).limit(1);
  return result[0] || null;
}

/**
 * Assign a permission to a role
 */
export async function assignPermissionToRole(roleName: string, permissionName: string) {
  const role = await getRoleByName(roleName);
  const permission = await getPermissionByName(permissionName);

  if (!role) {
    throw new Error(`Role '${roleName}' not found`);
  }

  if (!permission) {
    throw new Error(`Permission '${permissionName}' not found`);
  }

  // Check if already assigned
  const exists = await hasPermission(roleName, permissionName);
  if (exists) {
    return { message: 'Permission already assigned to role' };
  }

  await db.insert(rolePermissions).values({
    roleId: role.id,
    permissionId: permission.id,
  });

  return { message: 'Permission assigned to role successfully' };
}

/**
 * Remove a permission from a role
 */
export async function removePermissionFromRole(roleName: string, permissionName: string) {
  const role = await getRoleByName(roleName);
  const permission = await getPermissionByName(permissionName);

  if (!role) {
    throw new Error(`Role '${roleName}' not found`);
  }

  if (!permission) {
    throw new Error(`Permission '${permissionName}' not found`);
  }

  await db
    .delete(rolePermissions)
    .where(
      and(eq(rolePermissions.roleId, role.id), eq(rolePermissions.permissionId, permission.id))
    );

  return { message: 'Permission removed from role successfully' };
}

/**
 * Get role with all its permissions
 */
export async function getRoleWithPermissions(roleName: string) {
  const role = await getRoleByName(roleName);
  if (!role) {
    return null;
  }

  const perms = await getRolePermissions(roleName);

  return {
    ...role,
    permissions: perms,
  };
}
