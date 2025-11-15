import { Elysia } from 'elysia';
import { openapi } from '@elysiajs/openapi';
import { cors } from '@elysiajs/cors';
import { authRoutes } from './elysia/api/auth.ts';
import { usersRoutes } from './elysia/api/users.ts';
import { rolesRoutes } from './elysia/api/roles.ts';
import { analyticsRoutes } from './elysia/api/analytics.ts';
import { config } from './config/env';

// Create Elysia app
export const app = new Elysia()
  .use(cors({
    origin: config.cors.origin,
    credentials: true,
  }))
  .use(
    openapi({
      documentation: {
        info: {
          title: config.appName,
          version: '1.0.0',
          description: 'REST API with JWT authentication and RBAC',
        },
        tags: [
          { name: 'Auth', description: 'Authentication endpoints' },
          { name: 'Users', description: 'User management endpoints (CRUD)' },
          { name: 'RBAC', description: 'Role-based access control endpoints' },
          { name: 'Analytics', description: 'Dashboard analytics and insights' },
        ],
      },
    })
  )
  .get('/', () => ({
    message: `Welcome to ${config.appName} API`,
    version: '1.0.0',
    environment: config.nodeEnv,
    endpoints: {
      docs: '/openapi',
      auth: '/api/auth',
      users: '/api/users',
      rbac: '/api/rbac',
      analytics: '/api/analytics',
    },
  }))
  .group('/api', (app) =>
    app
      .use(authRoutes)
      .use(usersRoutes)
      .use(rolesRoutes)
      .use(analyticsRoutes)
  )
  .onError(({ code, error, set }) => {
    if (code === 'NOT_FOUND') {
      set.status = 404;
      return { error: 'Route not found' };
    }

    // Only log detailed errors in development
    if (config.isDevelopment()) {
      console.error('Error:', error);
    }

    return {
      error: config.isDevelopment()
        ? error.message || 'Internal server error'
        : 'Internal server error',
    };
  });

// Start server if running directly
if (import.meta.main) {
  const port = config.api.port;
  const host = config.api.host;

  app.listen(port, () => {
    console.log(`\n🚀 ${config.appName} API`);
    console.log(`   Environment: ${config.nodeEnv}`);
    console.log(`   Running on: http://${host}:${port}`);
    console.log(`   Documentation: http://${host}:${port}/openapi\n`);
  });
}

export type App = typeof app;
