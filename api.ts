import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';
import { authRoutes } from './elysia/api/auth';
import { usersRoutes } from './elysia/api/users';

// Create Elysia app
export const app = new Elysia()
  .use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }))
  .use(
    swagger({
      documentation: {
        info: {
          title: 'Nuxt 4 + Elysia API',
          version: '1.0.0',
          description: 'REST API with JWT authentication and RBAC',
        },
        tags: [
          { name: 'Auth', description: 'Authentication endpoints' },
          { name: 'Users', description: 'User management endpoints (CRUD)' },
        ],
      },
    })
  )
  .get('/', () => ({
    message: 'Welcome to Nuxt 4 + Elysia API',
    version: '1.0.0',
    endpoints: {
      docs: '/swagger',
      auth: '/api/auth',
      users: '/api/users',
    },
  }))
  .group('/api', (app) =>
    app
      .use(authRoutes)
      .use(usersRoutes)
  )
  .onError(({ code, error, set }) => {
    if (code === 'NOT_FOUND') {
      set.status = 404;
      return { error: 'Route not found' };
    }

    console.error('Error:', error);
    return {
      error: error.message || 'Internal server error',
    };
  });

// Start server if running directly
if (import.meta.main) {
  app.listen(3001, () => {
    console.log('🚀 Elysia API is running on http://localhost:3001');
    console.log('📚 API Documentation: http://localhost:3001/swagger');
  });
}

export type App = typeof app;
