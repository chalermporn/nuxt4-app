# Nuxt 4 + Elysia + Bun Quick Start Stack

## Overview
This project is a modern full-stack web application built with **Bun runtime**, combining the power of **Nuxt 4** for the frontend and **Elysia** for the backend API.

## Tech Stack

### Runtime
- **Bun** - Fast all-in-one JavaScript runtime (package manager, bundler, test runner)

### Frontend
- **Nuxt 4** (v4.0.3) - Vue-based meta-framework for building modern web applications
- **Vue 3** (v3.5.18) - Progressive JavaScript framework
- **Vue Router** (v4.5.1) - Official router for Vue.js

### Backend
- **Elysia** (v1.3.8) - Fast and ergonomic web framework for Bun
- **@elysiajs/eden** (v1.3.2) - End-to-end type-safe API client
- **@elysiajs/swagger** (v1.3.1) - OpenAPI documentation generator
- **nuxt-elysia** (v0.2.0) - Nuxt module for Elysia integration

### Database
- **db0** (v0.3.2) - Universal database abstraction layer

### UI & Styling
- **UnoCSS** (v66.4.2) - Instant on-demand atomic CSS engine
  - `@unocss/nuxt` - Nuxt module for UnoCSS
  - `@unocss/preset-wind4` - Tailwind CSS v4 compatible preset
- **@nuxtjs/color-mode** (v3.5.2) - Dark/light mode support
- **@nuxt/icon** (v2.0.0) - Icon component with 100,000+ ready to use icons
- **@iconify-json/carbon** (v1.2.13) - Carbon Design System icons
- **@iconify-json/ri** (v1.2.5) - Remix Icon set
- **vue-sonner** (v2.0.2) - Toast notification component

### State Management & Utilities
- **Pinia** (v3.0.3) - Vue Store for state management
- **@pinia/nuxt** (v0.11.2) - Nuxt module for Pinia
- **VueUse** (v13.6.0) - Collection of Vue Composition API utilities
  - `@vueuse/core` - Core composables
  - `@vueuse/nuxt` - Nuxt module
  - `@vueuse/components` - Component wrappers

### Developer Experience
- **@nuxt/devtools** (v2.6.2) - Powerful devtools for Nuxt
- **TypeScript** - Full type safety across the stack

## Project Structure

```
.
├── .github/          # GitHub workflows and configurations
├── .vscode/          # VSCode settings
├── app/              # Nuxt application code
├── elysia/           # Elysia API routes
│   └── api/          # API endpoints
├── public/           # Static assets
├── server/           # Server middleware
├── types/            # TypeScript type definitions
├── api.ts            # API entry point
├── biome.json        # Biome configuration (linter/formatter)
├── nuxt.config.ts    # Nuxt configuration
├── package.json      # Dependencies and scripts
├── tsconfig.json     # TypeScript configuration
└── unocss.config.ts  # UnoCSS configuration
```

## Key Features

### Type Safety
- End-to-end type safety from frontend to backend using Eden
- Full TypeScript support across the entire stack

### Performance
- Powered by Bun for ultra-fast build times and runtime performance
- UnoCSS for instant on-demand CSS generation
- Nuxt 4's optimized build system

### Developer Experience
- Nuxt DevTools for debugging and development
- Hot module replacement (HMR)
- Swagger/OpenAPI documentation for APIs
- Biome for fast linting and formatting

### Modern Architecture
- Modular API design with Elysia
- Component-based UI with Vue 3
- Composable patterns with VueUse
- Universal database abstraction with db0

## Scripts

```bash
# Development with Bun runtime
bun run dev

# Build for production
bun run build

# Generate static site
bun run generate

# Preview production build
bun run preview

# Type checking
bun run typecheck

# Post-install setup
bun run postinstall
```

## Language Distribution
- **TypeScript**: 60.1%
- **Vue**: 21.4%
- **CSS**: 18.5%

## Repository
[eastgold15/nuxt4-elysia-bun-quick-start](https://github.com/eastgold15/nuxt4-elysia-bun-quick-start)

---

*This stack provides a modern, performant, and type-safe development experience for building full-stack web applications with Bun runtime.*
