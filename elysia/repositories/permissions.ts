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

/**
 * Get role by ID
 */
export async function getRoleById(id: number) {
  const result = await db.select().from(roles).where(eq(roles.id, id)).limit(1);
  return result[0] || null;
}

/**
 * Create a new role
 */
export async function createRole(name: string, description?: string) {
  // Check if role already exists
  const existing = await getRoleByName(name);
  if (existing) {
    throw new Error(`Role '${name}' already exists`);
  }

  const [newRole] = await db
    .insert(roles)
    .values({
      name,
      description,
    })
    .returning();

  return newRole;
}

/**
 * Update a role
 */
export async function updateRole(id: number, data: { name?: string; description?: string }) {
  const existing = await getRoleById(id);
  if (!existing) {
    throw new Error(`Role with ID ${id} not found`);
  }

  // If updating name, check for conflicts
  if (data.name && data.name !== existing.name) {
    const conflict = await getRoleByName(data.name);
    if (conflict) {
      throw new Error(`Role '${data.name}' already exists`);
    }
  }

  const updateData: any = { updatedAt: new Date() };
  if (data.name) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;

  const [updatedRole] = await db
    .update(roles)
    .set(updateData)
    .where(eq(roles.id, id))
    .returning();

  return updatedRole;
}

/**
 * Delete a role
 */
export async function deleteRole(id: number) {
  const existing = await getRoleById(id);
  if (!existing) {
    throw new Error(`Role with ID ${id} not found`);
  }

  await db.delete(roles).where(eq(roles.id, id));
  return { message: 'Role deleted successfully' };
}

/**
 * Get permission by ID
 */
export async function getPermissionById(id: number) {
  const result = await db.select().from(permissions).where(eq(permissions.id, id)).limit(1);
  return result[0] || null;
}

/**
 * Create a new permission
 */
export async function createPermission(
  name: string,
  resource: string,
  action: string,
  description?: string
) {
  // Check if permission already exists
  const existing = await getPermissionByName(name);
  if (existing) {
    throw new Error(`Permission '${name}' already exists`);
  }

  const [newPermission] = await db
    .insert(permissions)
    .values({
      name,
      resource,
      action,
      description,
    })
    .returning();

  return newPermission;
}

/**
 * Update a permission
 */
export async function updatePermission(
  id: number,
  data: { name?: string; resource?: string; action?: string; description?: string }
) {
  const existing = await getPermissionById(id);
  if (!existing) {
    throw new Error(`Permission with ID ${id} not found`);
  }

  // If updating name, check for conflicts
  if (data.name && data.name !== existing.name) {
    const conflict = await getPermissionByName(data.name);
    if (conflict) {
      throw new Error(`Permission '${data.name}' already exists`);
    }
  }

  const updateData: any = {};
  if (data.name) updateData.name = data.name;
  if (data.resource) updateData.resource = data.resource;
  if (data.action) updateData.action = data.action;
  if (data.description !== undefined) updateData.description = data.description;

  const [updatedPermission] = await db
    .update(permissions)
    .set(updateData)
    .where(eq(permissions.id, id))
    .returning();

  return updatedPermission;
}

/**
 * Delete a permission
 */
export async function deletePermission(id: number) {
  const existing = await getPermissionById(id);
  if (!existing) {
    throw new Error(`Permission with ID ${id} not found`);
  }

  await db.delete(permissions).where(eq(permissions.id, id));
  return { message: 'Permission deleted successfully' };
}

/**
 * Get all permissions for a role by role ID
 */
export async function getRolePermissionsById(roleId: number) {
  const result = await db
    .select({
      permission: permissions,
    })
    .from(rolePermissions)
    .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .where(eq(rolePermissions.roleId, roleId));

  return result.map((r) => r.permission);
}

/**
 * Set permissions for a role (replaces all existing permissions)
 */
export async function setRolePermissions(roleId: number, permissionIds: number[]) {
  const role = await getRoleById(roleId);
  if (!role) {
    throw new Error(`Role with ID ${roleId} not found`);
  }

  // Delete existing permissions
  await db.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId));

  // Insert new permissions
  if (permissionIds.length > 0) {
    await db.insert(rolePermissions).values(
      permissionIds.map((permissionId) => ({
        roleId,
        permissionId,
      }))
    );
  }

  return { message: 'Role permissions updated successfully' };
}
