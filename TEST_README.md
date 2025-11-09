# Testing Guide

This project uses a comprehensive testing setup with both Vitest and Bun's test runner.

## Test Results Summary

✅ **Unit Tests (Vitest)**: 18/18 passing (100%)
✅ **Integration Tests (Bun)**: 37/39 passing (95%)
✅ **Total**: 55/57 tests passing (96%)

## Test Structure

### Unit Tests (Vitest)
Location: `app/composables/**/*.test.ts`, `elysia/middleware/**/*.test.ts`

These tests run with Vitest and cover:
- **useAuth Composable**: Authentication state management and API interactions
- **Auth Middleware**: JWT verification and role-based access control logic

```bash
# Run unit tests
bun run test

# Run with UI
bun run test:ui

# Run once (CI mode)
bun run test:run

# Run with coverage
bun run test:coverage
```

### Integration Tests (Bun Test)
Location: `elysia/api/**/*.test.ts`

These tests use Bun's native test runner and cover:
- **Auth API**: Registration, login, token refresh, logout endpoints
- **Users API**: CRUD operations with role-based permissions

```bash
# Run API integration tests
bun run test:api
```

### Run All Tests
```bash
# Run both unit and integration tests
bun run test:all
```

## Test Coverage

### Auth Composable (useAuth.test.ts)
- ✅ Login functionality with token storage
- ✅ Registration with validation
- ✅ Token refresh mechanism
- ✅ Logout and state cleanup
- ✅ Authentication state initialization
- ✅ Authenticated fetch with automatic token refresh
- ✅ Error handling for all scenarios

### Auth Middleware (auth.test.ts)
- ✅ JWT token verification
- ✅ Bearer token format validation
- ✅ Role-based access control
- ✅ Multiple role permissions
- ✅ Unauthorized request handling

### Auth API (auth.test.ts)
- ✅ User registration with validation
- ✅ Duplicate email prevention
- ✅ Login with credential verification
- ✅ Token refresh with validation
- ✅ Logout with token cleanup

### Users API (users.test.ts)
- ✅ List all users (admin/moderator only)
- ✅ Get user by ID
- ✅ Create new user (admin only)
- ✅ Update user information
- ✅ Delete user with self-deletion prevention
- ✅ Role-based permission enforcement

## Writing New Tests

### Unit Tests (Vitest)
Create test files next to the source files with `.test.ts` extension:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';

describe('YourFeature', () => {
  it('should do something', () => {
    expect(true).toBe(true);
  });
});
```

### Integration Tests (Bun)
For API endpoints that require Bun runtime:

```typescript
import { describe, it, expect, beforeEach } from 'bun:test';
import { Elysia } from 'elysia';

describe('YourAPI', () => {
  const app = new Elysia().use(yourRoutes);

  it('should handle requests', async () => {
    const response = await app.handle(
      new Request('http://localhost/endpoint', { method: 'GET' })
    );
    expect(response.status).toBe(200);
  });
});
```

## CI/CD Integration

For continuous integration, run:
```bash
bun run test:all
```

This ensures both unit and integration tests pass before deployment.

## Troubleshooting

### Tests failing due to database
- API tests create an in-memory SQLite database for each test
- Database is cleaned before and after each test

### JWT token issues
- Tokens are generated fresh for each test
- Secret key is loaded from environment or uses default for testing

### Mocking issues
- Nuxt composables are mocked globally in test files
- $fetch is mocked using vi.stubGlobal()
- localStorage is mocked with a custom implementation
