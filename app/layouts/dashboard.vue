<template>
  <div class="drawer lg:drawer-open">
    <!-- Drawer Toggle -->
    <input id="my-drawer" type="checkbox" class="drawer-toggle" />

    <!-- Main Content -->
    <div class="drawer-content flex flex-col min-h-screen bg-base-200">
      <!-- Navigation Bar -->
      <div class="navbar bg-base-100 shadow-lg sticky top-0 z-30">
        <div class="navbar-start">
          <label for="my-drawer" class="btn btn-square btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-5 h-5 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </label>
          <div class="flex items-center gap-2 lg:ml-0">
            <div class="avatar placeholder lg:hidden">
              <div class="bg-primary text-primary-content rounded-lg w-9 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div>
              <h1 class="text-xl font-bold">{{ pageTitle }}</h1>
              <div class="text-xs breadcrumbs p-0 min-h-0 hidden sm:block">
                <ul>
                  <li>Home</li>
                  <li>{{ pageTitle }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="navbar-end gap-2">
          <!-- Notifications -->
          <button class="btn btn-ghost btn-circle">
            <div class="indicator">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span class="badge badge-xs badge-primary indicator-item"></span>
            </div>
          </button>

          <!-- User Dropdown -->
          <div class="dropdown dropdown-end">
            <label tabindex="0" class="btn btn-ghost btn-circle avatar">
              <div class="avatar placeholder">
                <div class="bg-primary text-primary-content rounded-full w-9 flex items-center justify-center">
                  <span class="text-sm">{{ user?.name?.charAt(0).toUpperCase() }}</span>
                </div>
              </div>
            </label>
            <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li class="menu-title">
                <span>{{ user?.name }}</span>
              </li>
              <li><a class="pointer-events-none">
                <div :class="roleBadgeClass" class="badge badge-sm">{{ user?.role }}</div>
              </a></li>
              <li>
                <NuxtLink to="/profile">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/settings">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </NuxtLink>
              </li>
              <div class="divider my-0"></div>
              <li><a @click="handleLogout" class="text-error">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </a></li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <main class="flex-1 p-4 lg:p-6 max-w-7xl mx-auto w-full">
        <slot />
      </main>
    </div>

    <!-- Sidebar -->
    <div class="drawer-side z-40">
      <label for="my-drawer" class="drawer-overlay"></label>
      <aside class="bg-base-100 w-64 min-h-full flex flex-col shadow-xl">
        <!-- Logo/Brand -->
        <div class="p-4 border-b border-base-300">
          <div class="flex items-center gap-3">
            <div class="avatar placeholder">
              <div class="bg-primary text-primary-content rounded-lg w-10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div>
              <h2 class="font-bold text-lg">Dashboard</h2>
              <p class="text-xs text-base-content/60">Nuxt 4 App</p>
            </div>
          </div>
        </div>

        <!-- Navigation Menu -->
        <nav class="flex-1 p-4 overflow-y-auto">
          <ul class="menu gap-1">
            <!-- Main Section -->
            <li class="menu-title">
              <span>Main</span>
            </li>
            <li>
              <NuxtLink
                to="/"
                :class="{ 'active': route.path === '/' }"
                class="gap-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/dashboard"
                :class="{ 'active': route.path === '/dashboard' }"
                class="gap-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Dashboard
              </NuxtLink>
            </li>

            <!-- Management Section -->
            <li class="menu-title mt-4">
              <span>Management</span>
            </li>
            <li v-if="canManageUsers">
              <NuxtLink
                to="/users"
                :class="{ 'active': route.path === '/users' }"
                class="gap-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Users
                <span class="badge badge-sm badge-primary">{{ userCount }}</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/analytics"
                :class="{ 'active': route.path === '/analytics' }"
                class="gap-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Analytics
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/reports"
                :class="{ 'active': route.path === '/reports' }"
                class="gap-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Reports
              </NuxtLink>
            </li>

            <!-- Settings Section -->
            <li class="menu-title mt-4">
              <span>Settings</span>
            </li>
            <li>
              <NuxtLink
                to="/profile"
                :class="{ 'active': route.path === '/profile' }"
                class="gap-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/settings"
                :class="{ 'active': route.path === '/settings' }"
                class="gap-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <!-- User Info Footer -->
        <div class="p-4 border-t border-base-300">
          <div class="flex items-center gap-3 p-2 rounded-lg bg-base-200/50">
            <div class="avatar placeholder">
              <div class="bg-primary text-primary-content rounded-full w-10 flex items-center justify-center">
                <span class="text-sm font-semibold">{{ user?.name?.charAt(0).toUpperCase() }}</span>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-sm truncate">{{ user?.name }}</p>
              <div :class="roleBadgeClass" class="badge badge-xs">{{ user?.role }}</div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const route = useRoute();
const { user, logout, initAuth } = useAuth();

const userCount = ref(0);

const roleBadgeClass = computed(() => {
  const role = user.value?.role;
  if (role === 'admin') return 'badge-error';
  if (role === 'moderator') return 'badge-warning';
  return 'badge-info';
});

const canManageUsers = computed(() => {
  return user.value?.role === 'admin' || user.value?.role === 'moderator';
});

const pageTitle = computed(() => {
  const path = route.path;
  if (path === '/') return 'Home';
  if (path === '/dashboard') return 'Dashboard';
  if (path === '/users') return 'Users';
  if (path === '/analytics') return 'Analytics';
  if (path === '/reports') return 'Reports';
  if (path === '/profile') return 'Profile';
  if (path === '/settings') return 'Settings';
  return 'Dashboard';
});

const handleLogout = async () => {
  await logout();
  router.push('/login');
};

// Initialize auth on mount
onMounted(() => {
  initAuth();
});
</script>

<style scoped>
/* Dashboard layout styles */
.drawer-side {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.drawer-side::-webkit-scrollbar {
  width: 6px;
}

.drawer-side::-webkit-scrollbar-track {
  background: transparent;
}

.drawer-side::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.drawer-side::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}
</style>
