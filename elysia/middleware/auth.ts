import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { config } from '../../config/env';

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

// Types for JWT payload
export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
}
