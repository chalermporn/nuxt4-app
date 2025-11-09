# Nuxt 4 + Elysia + Bun + SQLite Full Stack App

Complete example with **JWT Authentication**, **RBAC**, **CRUD operations**, and **Drizzle ORM**.

## 🚀 Features

- ✅ **Nuxt 4** - Modern Vue.js framework
- ✅ **Elysia** - Fast web framework for Bun
- ✅ **Drizzle ORM** + **SQLite** - Type-safe database
- ✅ **JWT Authentication** - Access & Refresh tokens
- ✅ **RBAC** - Role-based access control (Admin, Moderator, User)
- ✅ **Full CRUD** - Complete user management
- ✅ **Swagger UI** - API documentation
- ✅ **TailwindCSS** - Utility-first styling

## 📁 Project Structure

```
.
├── api.ts                    # Elysia API entry point
├── db/
│   ├── schema.ts            # Database schema (users, refresh_tokens)
│   └── index.ts             # Database connection
├── drizzle.config.ts        # Drizzle configuration
├── elysia/
│   ├── api/
│   │   ├── auth.ts          # Auth endpoints (login, register, refresh)
│   │   └── users.ts         # CRUD endpoints with RBAC
│   └── middleware/
│       └── auth.ts          # JWT middleware & RBAC guards
├── app/
│   ├── pages/
│   │   ├── login.vue        # Login/Register page
│   │   └── dashboard.vue    # Dashboard with user management
│   └── composables/
│       └── useAuth.ts       # Auth composable
├── scripts/
│   └── seed.ts              # Database seed script
└── sqlite.db                # SQLite database (created after setup)
```

## 🛠️ Setup

### 1. Install Dependencies

```bash
bun install
```

### 2. Generate & Push Database Schema

```bash
# Generate migration files
bun run db:generate

# Push schema to database
bun run db:push
```

### 3. Seed Database

```bash
bun run db:seed
```

This creates 3 demo users:
- **Admin**: `admin@example.com` / `admin123`
- **Moderator**: `mod@example.com` / `mod123`
- **User**: `user@example.com` / `user123`

### 4. Run Development Servers

**Option 1: Run both servers separately**

Terminal 1 - Elysia API:
```bash
bun run api
```

Terminal 2 - Nuxt:
```bash
bun run dev
```

**Option 2: Run both together** (macOS/Linux)
```bash
bun run dev:all
```

### 5. Access the Application

- **Nuxt App**: http://localhost:3000
- **Elysia API**: http://localhost:3001
- **API Docs (Swagger)**: http://localhost:3001/swagger
- **Drizzle Studio**: `bun run db:studio` → http://localhost:4983

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/refresh` | Refresh access token | No |
| POST | `/api/auth/logout` | Logout user | No |

### User Management (CRUD)

| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|---------------|
| GET | `/api/users` | Get all users | Admin, Moderator |
| GET | `/api/users/:id` | Get user by ID | Admin, Moderator |
| POST | `/api/users` | Create new user | Admin |
| PATCH | `/api/users/:id` | Update user | Admin |
| DELETE | `/api/users/:id` | Delete user | Admin |

## 🔒 Authentication Flow

### Login/Register
1. User submits credentials
2. Backend validates and creates JWT tokens
3. Access token (15min) + Refresh token (7days) returned
4. Tokens stored in localStorage

### API Requests
1. Access token sent in `Authorization: Bearer <token>` header
2. Middleware verifies token and extracts user info
3. RBAC middleware checks user role permissions
4. Request processed if authorized

### Token Refresh
1. When access token expires (401 error)
2. Frontend automatically calls `/api/auth/refresh` with refresh token
3. New access token returned
4. Original request retried with new token

## 👥 User Roles & Permissions

### Admin
- ✅ View all users
- ✅ Create new users
- ✅ Edit any user
- ✅ Delete users (except self)
- ✅ Assign roles

### Moderator
- ✅ View all users
- ✅ View user details
- ❌ Create/Edit/Delete users

### User
- ❌ No access to user management

## 🧪 Testing the API

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'
```

**Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

**Get Users (with auth):**
```bash
curl -X GET http://localhost:3001/api/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start Nuxt development server |
| `bun run api` | Start Elysia API server |
| `bun run dev:all` | Start both servers (macOS/Linux) |
| `bun run build` | Build Nuxt for production |
| `bun run preview` | Preview production build |
| `bun run db:generate` | Generate Drizzle migrations |
| `bun run db:migrate` | Run migrations |
| `bun run db:push` | Push schema to database |
| `bun run db:studio` | Open Drizzle Studio |
| `bun run db:seed` | Seed database with demo data |

## 🔧 Environment Variables

Create `.env` file (optional):

```env
JWT_SECRET=your-super-secret-key-change-this-in-production
DATABASE_URL=./sqlite.db
API_PORT=3001
```

## 📝 Database Schema

### Users Table
```typescript
{
  id: number (Primary Key, Auto Increment)
  email: string (Unique)
  password: string (Hashed with bcrypt)
  name: string
  role: 'admin' | 'user' | 'moderator' (Default: 'user')
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Refresh Tokens Table
```typescript
{
  id: number (Primary Key, Auto Increment)
  userId: number (Foreign Key → users.id)
  token: string (Unique)
  expiresAt: timestamp
  createdAt: timestamp
}
```

## 🎨 Frontend Pages

### Login Page (`/login`)
- Login form
- Register form (toggle)
- Demo account info
- Error/success messages
- Auto-redirect if authenticated

### Dashboard (`/dashboard`)
- User info display
- Role badge
- User management table (Admin/Moderator only)
- Create user modal (Admin only)
- Edit user modal (Admin only)
- Delete user button (Admin only)
- Logout button
- Auth guard (redirect if not authenticated)

## 🐛 Troubleshooting

### Database locked error
```bash
# Remove existing database and recreate
rm sqlite.db
bun run db:push
bun run db:seed
```

### Port already in use
```bash
# Change port in api.ts
app.listen(3002) // Change from 3001
```

### Module not found errors
```bash
# Clear cache and reinstall
rm -rf node_modules bun.lockb
bun install
```

## 📖 Learn More

- [Nuxt Documentation](https://nuxt.com/docs)
- [Elysia Documentation](https://elysiajs.com)
- [Drizzle ORM](https://orm.drizzle.team)
- [Bun Documentation](https://bun.sh/docs)

## 📄 License

MIT

---

**Made with ❤️ using Bun, Nuxt 4, Elysia, and Drizzle ORM**
