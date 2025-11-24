# Walkthrough - Add updatedAt to User API Response

I have successfully added the `updatedAt` field to the `GET /api/users` endpoint.

## Changes

### [users.ts](file:///Users/bird/DEMO/NUXT/nuxt4-app/elysia/api/users.ts)

Updated the database query to include the `updatedAt` column.

```typescript
// elysia/api/users.ts

// ...
          role: users.role,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt, // Added this line
        })
// ...
```

## Verification Results

### Automated Verification

I created a test script `scripts/verify_users_api.test.ts` that:
1.  Logs in as the demo Admin.
2.  Fetches the list of users.
3.  Verifies that the first user object contains the `updatedAt` property.

**Test Output:**
```
scripts/verify_users_api.test.ts:
First user: {
  id: 23,
  email: "admin@example.com",
  name: "Admin User",
  role: "admin",
  createdAt: "2025-11-17T00:49:21.000Z",
  updatedAt: "2025-11-17T00:50:12.000Z",
}
(pass) Users API Verification > should include updatedAt in users list [135.59ms]
```

The test passed, confirming the API now returns the expected field.
