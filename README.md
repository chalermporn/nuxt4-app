# Nuxt 4 + Elysia + Bun Full Stack App

🚀 **Complete example** with JWT Auth, RBAC, CRUD, and Drizzle ORM on SQLite

## ✨ Features

- ✅ **JWT Authentication** - Access & Refresh tokens
- ✅ **RBAC** - Role-based access control (Admin, Moderator, User)
- ✅ **Full CRUD** - Complete user management
- ✅ **Drizzle ORM** - Type-safe database operations
- ✅ **SQLite** - Lightweight database
- ✅ **Swagger UI** - Auto-generated API docs
- ✅ **TailwindCSS** - Modern responsive design

## 🚀 Quick Start

```bash
# 1. Install dependencies
bun install

# 2. Setup database
bun run db:push
bun run db:seed

# 3. Start API server (Terminal 1)
bun run api

# 4. Start Nuxt (Terminal 2)
bun run dev
```

Open http://localhost:3000 and login with:
- **Admin**: `admin@example.com` / `admin123`
- **Moderator**: `mod@example.com` / `mod123`
- **User**: `user@example.com` / `user123`

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Quick start guide (Thai) 🇹🇭
- **[USAGE.md](./USAGE.md)** - Complete documentation
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Project files & structure
- **[init.md](./init.md)** - Tech stack overview

## 🛠️ Tech Stack

- **Bun** - JavaScript runtime
- **Nuxt 4** - Vue.js framework
- **Elysia** - Web framework for Bun
- **Drizzle ORM** - Type-safe ORM
- **SQLite** - Database
- **JWT** - Authentication
- **TailwindCSS** - Styling

## 📦 Scripts

```bash
bun run dev          # Start Nuxt
bun run api          # Start Elysia API
bun run dev:all      # Start both servers
bun run build        # Build for production
bun run db:push      # Push schema to DB
bun run db:seed      # Seed demo data
bun run db:studio    # Open Drizzle Studio

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
