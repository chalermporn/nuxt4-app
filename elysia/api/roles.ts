import { Elysia, t } from 'elysia';
import { jwtConfig, authMiddleware, requireRole } from '../middleware/auth';
import {
  getAllRoles,
  getAllPermissions,
  getRoleById,
  getPermissionById,
  createRole,
  updateRole,
  deleteRole,
  createPermission,
  updatePermission,
  deletePermission,
  getRolePermissionsById,
  setRolePermissions,
} from '../repositories/permissions';

// Admin-only routes for roles and permissions management
const adminOnlyRoutes = new Elysia()
  .use(jwtConfig)
  .use(authMiddleware)
  .use(requireRole(['admin']))

  // Get all roles
  .get('/roles', async ({ set }) => {
    try {
      const roles = await getAllRoles();
      return { roles };
    } catch (error) {
      set.status = 500;
      return { error: 'Failed to fetch roles' };
    }
  })

  // Get single role by ID
  .get(
    '/roles/:id',
    async ({ params, set }) => {
      try {
        const role = await getRoleById(parseInt(params.id));
        if (!role) {
          set.status = 404;
          return { error: 'Role not found' };
        }
        return { role };
      } catch (error) {
        set.status = 500;
        return { error: 'Failed to fetch role' };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )

  // Create new role
  .post(
    '/roles',
    async ({ body, set }) => {
      try {
        const newRole = await createRole(body.name, body.description);
        return {
          message: 'Role created successfully',
          role: newRole,
        };
      } catch (error) {
        set.status = 400;
        return { error: error instanceof Error ? error.message : 'Failed to create role' };
      }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 2 }),
        description: t.Optional(t.String()),
      }),
    }
  )

  // Update role
  .patch(
    '/roles/:id',
    async ({ params, body, set }) => {
      try {
        const roleId = parseInt(params.id);
        const updatedRole = await updateRole(roleId, body);
        return {
          message: 'Role updated successfully',
          role: updatedRole,
        };
      } catch (error) {
        set.status = error instanceof Error && error.message.includes('not found') ? 404 : 400;
        return { error: error instanceof Error ? error.message : 'Failed to update role' };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        name: t.Optional(t.String({ minLength: 2 })),
        description: t.Optional(t.String()),
      }),
    }
  )

  // Delete role
  .delete(
    '/roles/:id',
    async ({ params, set }) => {
      try {
        const roleId = parseInt(params.id);
        await deleteRole(roleId);
        return {
          message: 'Role deleted successfully',
          deletedRoleId: roleId,
        };
      } catch (error) {
        set.status = error instanceof Error && error.message.includes('not found') ? 404 : 500;
        return { error: error instanceof Error ? error.message : 'Failed to delete role' };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )

  // Get permissions for a role
  .get(
    '/roles/:id/permissions',
    async ({ params, set }) => {
      try {
        const roleId = parseInt(params.id);
        const role = await getRoleById(roleId);
        if (!role) {
          set.status = 404;
          return { error: 'Role not found' };
        }
        const permissions = await getRolePermissionsById(roleId);
        return { permissions };
      } catch (error) {
        set.status = 500;
        return { error: 'Failed to fetch role permissions' };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )

  // Set permissions for a role (replace all)
  .put(
    '/roles/:id/permissions',
    async ({ params, body, set }) => {
      try {
        const roleId = parseInt(params.id);
        await setRolePermissions(roleId, body.permissionIds);
        return {
          message: 'Role permissions updated successfully',
        };
      } catch (error) {
        set.status = error instanceof Error && error.message.includes('not found') ? 404 : 400;
        return { error: error instanceof Error ? error.message : 'Failed to update role permissions' };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        permissionIds: t.Array(t.Number()),
      }),
    }
  )

  // Get all permissions
  .get('/permissions', async ({ set }) => {
    try {
      const permissions = await getAllPermissions();
      return { permissions };
    } catch (error) {
      set.status = 500;
      return { error: 'Failed to fetch permissions' };
    }
  })

  // Get single permission by ID
  .get(
    '/permissions/:id',
    async ({ params, set }) => {
      try {
        const permission = await getPermissionById(parseInt(params.id));
        if (!permission) {
          set.status = 404;
          return { error: 'Permission not found' };
        }
        return { permission };
      } catch (error) {
        set.status = 500;
        return { error: 'Failed to fetch permission' };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )

  // Create new permission
  .post(
    '/permissions',
    async ({ body, set }) => {
      try {
        const newPermission = await createPermission(
          body.name,
          body.resource,
          body.action,
          body.description
        );
        return {
          message: 'Permission created successfully',
          permission: newPermission,
        };
      } catch (error) {
        set.status = 400;
        return { error: error instanceof Error ? error.message : 'Failed to create permission' };
      }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 2 }),
        resource: t.String({ minLength: 2 }),
        action: t.String({ minLength: 2 }),
        description: t.Optional(t.String()),
      }),
    }
  )

  // Update permission
  .patch(
    '/permissions/:id',
    async ({ params, body, set }) => {
      try {
        const permissionId = parseInt(params.id);
        const updatedPermission = await updatePermission(permissionId, body);
        return {
          message: 'Permission updated successfully',
          permission: updatedPermission,
        };
      } catch (error) {
        set.status = error instanceof Error && error.message.includes('not found') ? 404 : 400;
        return { error: error instanceof Error ? error.message : 'Failed to update permission' };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        name: t.Optional(t.String({ minLength: 2 })),
        resource: t.Optional(t.String({ minLength: 2 })),
        action: t.Optional(t.String({ minLength: 2 })),
        description: t.Optional(t.String()),
      }),
    }
  )

  // Delete permission
  .delete(
    '/permissions/:id',
    async ({ params, set }) => {
      try {
        const permissionId = parseInt(params.id);
        await deletePermission(permissionId);
        return {
          message: 'Permission deleted successfully',
          deletedPermissionId: permissionId,
        };
      } catch (error) {
        set.status = error instanceof Error && error.message.includes('not found') ? 404 : 500;
        return { error: error instanceof Error ? error.message : 'Failed to delete permission' };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  );

// Combine all routes
export const rolesRoutes = new Elysia({ prefix: '/rbac' }).use(adminOnlyRoutes);
