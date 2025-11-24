# System Analysis: Nuxt 4 + ElysiaJS App

## 🏗 Architecture Overview

This project is a full-stack application using a modern, high-performance stack:

- **Runtime**: [Bun](https://bun.sh) (v1.3+)
- **Frontend**: [Nuxt 4](https://nuxt.com) (Vue 3)
- **Backend**: [ElysiaJS](https://elysiajs.com)
- **Database**: SQLite with [Drizzle ORM](https://orm.drizzle.team)
- **Styling**: TailwindCSS (v4) + Nuxt UI

The project follows a monorepo-like structure where both frontend and backend reside in the same repository but run as separate processes during development.

## 📂 Key Components

### 1. Frontend (Nuxt 4)
- **Location**: `app/`
- **Configuration**: `nuxt.config.ts` is minimal, leveraging `@nuxt/ui` and `@tailwindcss/vite`.
- **Authentication**:
  - Implemented via `app/composables/useAuth.ts`.
  - Uses **JWT** (Access + Refresh Tokens).
  - Stores tokens in `localStorage` and `useState`.
  - Handles automatic token refreshing on 401 errors.
  - **Note**: The API URL is currently hardcoded (`http://localhost:3001/api`).

### 2. Backend (ElysiaJS)
- **Location**: `elysia/` & `api.ts`
- **Entry Point**: `api.ts` initializes the server, CORS, and Swagger.
- **API Structure**:
  - `/api/auth`: Login, Register, Refresh, Logout
  - `/api/users`: CRUD operations (RBAC protected)
  - `/api/roles`: Role management
  - `/api/analytics`: Dashboard data
- **Documentation**: Auto-generated Swagger UI at `/openapi`.

### 3. Database
- **Location**: `db/`
- **Technology**: SQLite (via `bun:sqlite`) managed by Drizzle ORM.
- **Schema**: Likely defined in `db/schema.ts`.
- **Management**: Scripts provided for migration (`db:migrate`) and seeding (`db:seed`).

## 🔄 Development Workflow

The `package.json` provides convenient scripts for development:

- **`bun run dev:all`**: Starts both Nuxt (port 3000) and Elysia (port 3001) concurrently.
- **`bun run db:setup`**: Runs migrations and seeds the database with demo data.
- **`bun run api`**: Runs only the backend.
- **`bun run dev`**: Runs only the frontend.

## 💡 Observations & Recommendations

1.  **Environment Configuration**:
    - The API URL in `useAuth.ts` is hardcoded. It is recommended to move this to `nuxt.config.ts` using `runtimeConfig` to support different environments (dev, uat, prod).

2.  **Security**:
    - **Token Storage**: Currently uses `localStorage`. While convenient, it exposes tokens to XSS attacks. Consider using **HttpOnly Cookies** for better security, though this requires configuring the backend to set cookies and potentially using a proxy in Nuxt to forward requests.

3.  **Type Safety**:
    - Since both frontend and backend are in the same repo, consider creating a shared `types` package or directory to share interfaces (like `User`, `AuthResponse`) between `app/` and `elysia/` to ensure contract consistency.

4.  **Testing**:
    - Vitest is configured (`vitest.config.ts`). There are scripts for running tests (`test:run`, `test:api`), which is excellent for maintaining code quality.
