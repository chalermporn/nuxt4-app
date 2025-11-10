# Environment Configuration Guide

โปรเจกต์นี้รองรับการทำงานหลาย environment โดยใช้ไฟล์ `.env` แยกตามแต่ละ environment

## 📁 Environment Files

```
.env.example       # Template สำหรับสร้าง env file ใหม่
.env.development   # Development environment
.env.uat          # UAT environment
.env.production   # Production environment
```

## 🚀 การใช้งาน

### 1. Setup เริ่มต้น

คัดลอก `.env.example` เป็น environment ที่ต้องการ:

```bash
# Development (ถูกสร้างไว้แล้ว)
cp .env.example .env.development

# UAT (ถูกสร้างไว้แล้ว)
cp .env.example .env.uat

# Production (ถูกสร้างไว้แล้ว)
cp .env.example .env.production
```

### 2. Run แต่ละ Environment

#### Development
```bash
# Nuxt only
bun run dev

# API only
bun run api

# Both (Nuxt + API)
bun run dev:all
```

#### UAT
```bash
# Nuxt only
bun run dev:uat

# API only
bun run api:uat

# Both (Nuxt + API)
bun run dev:all:uat
```

#### Production
```bash
# Build
bun run build

# API
bun run api:prod
```

### 3. Database Management

#### Development
```bash
# Generate migrations
bun run db:generate

# Run migrations
bun run db:migrate

# Push schema changes
bun run db:push

# Seed data
bun run db:seed

# Open Drizzle Studio
bun run db:studio
```

#### UAT
```bash
bun run db:migrate:uat
bun run db:push:uat
bun run db:seed:uat
```

#### Production
```bash
bun run db:migrate:prod
bun run db:push:prod
```

## 🔐 Environment Variables

### Application
- `NODE_ENV` - Environment name (development, uat, production)
- `APP_NAME` - Application name
- `APP_PORT` - Nuxt app port (default: 3000)

### API Server (Elysia)
- `API_PORT` - API server port (default: 3001)
- `API_HOST` - API server hostname

### Database
- `DATABASE_PATH` - SQLite database file path
  - Development: `./sqlite.dev.db`
  - UAT: `./sqlite.uat.db`
  - Production: `./sqlite.prod.db`

### JWT Authentication
- `JWT_SECRET` - ⚠️ **สำคัญมาก!** เปลี่ยน secret key ใน production
- `JWT_ACCESS_TOKEN_EXPIRY` - Access token expiry time (default: 15m)
- `JWT_REFRESH_TOKEN_EXPIRY_DAYS` - Refresh token expiry days (default: 7)

### CORS
- `CORS_ORIGIN` - Allowed CORS origin
  - Development: `http://localhost:3000`
  - UAT: `https://uat.example.com`
  - Production: `https://example.com`

### Logging
- `LOG_LEVEL` - Log level (debug, info, warn, error)

## 📝 ตัวอย่าง Environment Files

### Development (.env.development)
```env
NODE_ENV=development
APP_NAME=Nuxt4 App (Dev)
API_PORT=3001
DATABASE_PATH=./sqlite.dev.db
JWT_SECRET=dev-secret-key
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=debug
```

### UAT (.env.uat)
```env
NODE_ENV=uat
APP_NAME=Nuxt4 App (UAT)
API_PORT=3001
DATABASE_PATH=./sqlite.uat.db
JWT_SECRET=uat-secret-key-change-this
CORS_ORIGIN=https://uat.example.com
LOG_LEVEL=info
```

### Production (.env.production)
```env
NODE_ENV=production
APP_NAME=Nuxt4 App
API_PORT=3001
DATABASE_PATH=./sqlite.prod.db
JWT_SECRET=CHANGE_THIS_TO_STRONG_SECRET
CORS_ORIGIN=https://example.com
LOG_LEVEL=warn
```

## 🔒 Security Best Practices

1. **ห้าม commit** ไฟล์ `.env.*` (ยกเว้น `.env.example`)
2. **เปลี่ยน JWT_SECRET** ทุกครั้งใน production
3. ใช้ **strong random secret** สำหรับ JWT
4. เก็บ **sensitive data** ใน environment variables
5. ใช้ **different databases** สำหรับแต่ละ environment

## 🛠 Development Tips

### ดู environment ปัจจุบัน
```bash
echo $NODE_ENV
```

### Set environment ชั่วคราว
```bash
NODE_ENV=uat bun run api
```

### ใช้ config ใน code
```typescript
import { config } from './config/env';

console.log(config.nodeEnv);        // 'development'
console.log(config.database.path);  // './sqlite.dev.db'
console.log(config.jwt.secret);     // JWT secret

// Helper methods
if (config.isDevelopment()) {
  console.log('Running in development mode');
}
```

## 🧪 Testing

Tests จะใช้ environment variables จาก `.env.test` (ถ้ามี) หรือ default values:

```bash
bun run test        # Run all tests
bun run test:api    # API tests only
bun run test:coverage  # With coverage
```

## 📚 Additional Resources

- [Nuxt Environment Variables](https://nuxt.com/docs/guide/going-further/runtime-config)
- [Elysia Configuration](https://elysiajs.com/patterns/configuration.html)
- [Drizzle ORM](https://orm.drizzle.team/docs/overview)

## ❓ Troubleshooting

### ปัญหา: ไม่สามารถโหลด environment variables
```bash
# ตรวจสอบว่าไฟล์ .env มีอยู่
ls -la .env.*

# ตรวจสอบ syntax ในไฟล์
cat .env.development
```

### ปัญหา: Database connection error
```bash
# ตรวจสอบ DATABASE_PATH
echo $DATABASE_PATH

# สร้าง database ใหม่
bun run db:push
```

### ปัญหา: JWT authentication error
```bash
# ตรวจสอบ JWT_SECRET
echo $JWT_SECRET

# ต้องตั้งค่า JWT_SECRET ใน .env
```
