import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { config } from '../../config/env';
import { hasPermission, hasResourcePermission } from '../repositories/permissions';

// JWT configuration using environment variables
export const jwtConfig = new Elysia()
  .use(
    jwt({
      name: 'jwt',
      secret: config.jwt.secret,
      exp: config.jwt.accessTokenExpiry,
    })
  );

// Auth middleware - verify JWT token
export const authMiddleware = (app: Elysia) =>
  app.derive(async ({ jwt, headers, set }) => {
    const auth = headers.authorization;

    if (!auth || !auth.startsWith('Bearer ')) {
      set.status = 401;
      throw new Error('Unauthorized: No token provided');
    }

    const token = auth.split(' ')[1];
    const payload = await jwt.verify(token);

    if (!payload) {
      set.status = 401;
      throw new Error('Unauthorized: Invalid token');
    }

    return {
      user: {
        id: payload.userId as number,
        email: payload.email as string,
        role: payload.role as string,
      },
    };
  });

// Role-based access control middleware
export const requireRole = (allowedRoles: string[]) => {
  return (app: Elysia) =>
    app.derive(({ user, set }) => {
      if (!user || !allowedRoles.includes(user.role)) {
        set.status = 403;
        throw new Error('Forbidden: Insufficient permissions');
      }
      return { user };
    });
};

/**
 * Permission-based access control middleware
 * Checks if the user's role has the specified permission
 *
 * @param permissionName - Permission name (e.g., 'users:create', 'users:read')
 * @example
 * .use(requirePermission('users:create'))
 */
export const requirePermission = (permissionName: string) => {
  return (app: Elysia) =>
    app.derive(async ({ user, set }) => {
      if (!user) {
        set.status = 401;
        throw new Error('Unauthorized: No user found');
      }

      const hasAccess = await hasPermission(user.role, permissionName);

      if (!hasAccess) {
        set.status = 403;
        throw new Error(`Forbidden: Missing permission '${permissionName}'`);
      }

      return { user };
    });
};

/**
 * Resource-based permission middleware
 * Checks if the user's role has permission for a specific resource:action
 *
 * @param resource - Resource name (e.g., 'users', 'posts', 'settings')
 * @param action - Action name (e.g., 'create', 'read', 'update', 'delete')
 * @example
 * .use(requireResourcePermission('users', 'create'))
 */
export const requireResourcePermission = (resource: string, action: string) => {
  return (app: Elysia) =>
    app.derive(async ({ user, set }) => {
      if (!user) {
        set.status = 401;
        throw new Error('Unauthorized: No user found');
      }

      const hasAccess = await hasResourcePermission(user.role, resource, action);

      if (!hasAccess) {
        set.status = 403;
        throw new Error(`Forbidden: Missing permission '${resource}:${action}'`);
      }

      return { user };
    });
};

/**
 * Check if user has any of the specified permissions
 *
 * @param permissionNames - Array of permission names
 * @example
 * .use(requireAnyPermission(['users:read', 'users:list']))
 */
export const requireAnyPermission = (permissionNames: string[]) => {
  return (app: Elysia) =>
    app.derive(async ({ user, set }) => {
      if (!user) {
        set.status = 401;
        throw new Error('Unauthorized: No user found');
      }

      const checks = await Promise.all(
        permissionNames.map((perm) => hasPermission(user.role, perm))
      );

      const hasAnyAccess = checks.some((hasAccess) => hasAccess);

      if (!hasAnyAccess) {
        set.status = 403;
        throw new Error(`Forbidden: Missing any of permissions: ${permissionNames.join(', ')}`);
      }

      return { user };
    });
};

/**
 * Check if user has all of the specified permissions
 *
 * @param permissionNames - Array of permission names
 * @example
 * .use(requireAllPermissions(['users:read', 'users:update']))
 */
export const requireAllPermissions = (permissionNames: string[]) => {
  return (app: Elysia) =>
    app.derive(async ({ user, set }) => {
      if (!user) {
        set.status = 401;
        throw new Error('Unauthorized: No user found');
      }

      const checks = await Promise.all(
        permissionNames.map((perm) => hasPermission(user.role, perm))
      );

      const hasAllAccess = checks.every((hasAccess) => hasAccess);

      if (!hasAllAccess) {
        set.status = 403;
        const missingPerms = permissionNames.filter((_, i) => !checks[i]);
        throw new Error(`Forbidden: Missing permissions: ${missingPerms.join(', ')}`);
      }

      return { user };
    });
};

// Types for JWT payload
export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
}
