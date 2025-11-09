# 🚀 Quick Start Guide

## เริ่มต้นใช้งานภายใน 2 นาที!

### 1️⃣ Install Dependencies
```bash
bun install
```

### 2️⃣ Setup Database
```bash
# สร้าง database schema
bun run db:push

# เพิ่มข้อมูลทดสอบ (3 users: admin, moderator, user)
bun run db:seed
```

### 3️⃣ Run Servers

**เปิด 2 terminals:**

**Terminal 1 - API Server (Elysia):**
```bash
bun run api
```
✅ API จะรันที่ `http://localhost:3001`
✅ Swagger Docs: `http://localhost:3001/swagger`

**Terminal 2 - Frontend (Nuxt):**
```bash
bun run dev
```
✅ App จะรันที่ `http://localhost:3000`

### 4️⃣ Login

เปิดเบราว์เซอร์ที่ `http://localhost:3000`

**ทดสอบด้วย Demo Accounts:**

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| 🔴 **Admin** | `admin@example.com` | `admin123` | View, Create, Edit, Delete users |
| 🟡 **Moderator** | `mod@example.com` | `mod123` | View users only |
| 🔵 **User** | `user@example.com` | `user123` | No access to user management |

---

## 📦 คำสั่งที่ใช้บ่อย

```bash
# Database
bun run db:push      # Push schema to database
bun run db:seed      # Seed demo data
bun run db:studio    # Open Drizzle Studio (DB viewer)

# Development
bun run api          # Start API server (port 3001)
bun run dev          # Start Nuxt (port 3000)
bun run dev:all      # Start both servers (macOS/Linux)

# Production
bun run build        # Build for production
bun run preview      # Preview production build
```

---

## 🧪 ทดสอบ API ด้วย cURL

### Register User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "password123",
    "name": "New User"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

Response จะได้:
```json
{
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### Get All Users (ต้องมี Admin/Moderator role)
```bash
curl -X GET http://localhost:3001/api/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🎯 Features Overview

### ✅ Authentication
- JWT Access Token (15 นาที)
- Refresh Token (7 วัน)
- Auto token refresh เมื่อหมดอายุ
- Secure password hashing (bcrypt)

### ✅ RBAC (Role-Based Access Control)
- **Admin**: จัดการ users ได้ทั้งหมด (CRUD)
- **Moderator**: ดู users ได้อย่างเดียว
- **User**: ไม่มีสิทธิ์จัดการ users

### ✅ CRUD Operations
- Create user (Admin only)
- Read users (Admin, Moderator)
- Update user (Admin only)
- Delete user (Admin only)

### ✅ Tech Stack
- **Bun** - Runtime
- **Nuxt 4** - Frontend
- **Elysia** - API Framework
- **Drizzle ORM** - Database ORM
- **SQLite** - Database
- **TailwindCSS** - Styling

---

## 🐛 Troubleshooting

### ❌ Port already in use
```bash
# หา process ที่ใช้ port 3001
lsof -ti:3001 | xargs kill -9

# หรือเปลี่ยน port ใน api.ts
app.listen(3002) // เปลี่ยนจาก 3001
```

### ❌ Database locked
```bash
# ลบ database และสร้างใหม่
rm sqlite.db*
bun run db:push
bun run db:seed
```

### ❌ Module not found
```bash
# ลบและติดตั้งใหม่
rm -rf node_modules
bun install
```

---

## 📚 ดูเอกสารเพิ่มเติม

- [USAGE.md](./USAGE.md) - Full documentation
- [init.md](./init.md) - Tech stack overview

---

**🎉 Happy Coding!**
