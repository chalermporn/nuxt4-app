<template>
  <div>
    <!-- Alerts -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="error" role="alert" class="alert alert-error mb-6 shadow-lg border-l-4 border-error">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="font-medium">{{ error }}</span>
      </div>
    </Transition>

    <!-- Header Section -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold mb-3 bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
        User Activity
      </h1>
      <p class="text-base-content/60">Monitor user actions and system events</p>
    </div>

    <!-- Admin Only Content -->
    <div v-if="isAdmin">
      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <!-- Today's Activity Card -->
        <div class="relative bg-linear-to-br from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/20 overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div class="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
          <div class="relative flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-base-content/60 mb-2">Today</p>
              <h3 class="text-4xl font-bold text-primary mb-1">{{ todayActivityCount }}</h3>
              <p class="text-xs text-base-content/50">Events today</p>
            </div>
            <div class="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 stroke-primary" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- This Week Card -->
        <div class="relative bg-linear-to-br from-secondary/10 to-secondary/5 rounded-2xl p-6 border border-secondary/20 overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div class="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
          <div class="relative flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-base-content/60 mb-2">This Week</p>
              <h3 class="text-4xl font-bold text-secondary mb-1">{{ weekActivityCount }}</h3>
              <p class="text-xs text-base-content/50">Events this week</p>
            </div>
            <div class="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 stroke-secondary" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Active Users Card -->
        <div class="relative bg-linear-to-br from-success/10 to-success/5 rounded-2xl p-6 border border-success/20 overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div class="absolute top-0 right-0 w-32 h-32 bg-success/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
          <div class="relative flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-base-content/60 mb-2">Active Users</p>
              <h3 class="text-4xl font-bold text-success mb-1">{{ activeUsersCount }}</h3>
              <p class="text-xs text-base-content/50">Last 24 hours</p>
            </div>
            <div class="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 stroke-success" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Total Events Card -->
        <div class="relative bg-linear-to-br from-accent/10 to-accent/5 rounded-2xl p-6 border border-accent/20 overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div class="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
          <div class="relative flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-base-content/60 mb-2">Total Events</p>
              <h3 class="text-4xl font-bold text-accent mb-1">{{ activities.length }}</h3>
              <p class="text-xs text-base-content/50">All time</p>
            </div>
            <div class="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 stroke-accent" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-base-100 rounded-2xl shadow-xl border border-base-300/50 p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="label">
              <span class="label-text font-semibold">Search</span>
            </label>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search activities..."
              class="input input-bordered w-full"
            />
          </div>
          <div>
            <label class="label">
              <span class="label-text font-semibold">Event Type</span>
            </label>
            <select v-model="eventFilter" class="select select-bordered w-full">
              <option value="">All Events</option>
              <option value="login">Login</option>
              <option value="logout">Logout</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
            </select>
          </div>
          <div>
            <label class="label">
              <span class="label-text font-semibold">User</span>
            </label>
            <select v-model="userFilter" class="select select-bordered w-full">
              <option value="">All Users</option>
              <option v-for="u in uniqueUsers" :key="u" :value="u">{{ u }}</option>
            </select>
          </div>
          <div>
            <label class="label">
              <span class="label-text font-semibold">Time Range</span>
            </label>
            <select v-model="timeFilter" class="select select-bordered w-full">
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Activity Timeline -->
      <div class="bg-base-100 rounded-2xl shadow-xl border border-base-300/50 overflow-hidden">
        <div class="p-8">
          <h2 class="text-2xl font-bold mb-6">Activity Timeline</h2>

          <!-- Loading State -->
          <div v-if="loading" class="flex flex-col items-center justify-center py-12">
            <span class="loading loading-spinner loading-lg text-primary"></span>
            <p class="mt-4">Loading activities...</p>
          </div>

          <!-- Activity List -->
          <div v-else-if="filteredActivities.length > 0" class="space-y-4">
            <div
              v-for="activity in paginatedActivities"
              :key="activity.id"
              class="flex items-start gap-4 p-4 rounded-xl hover:bg-base-200/50 transition-all duration-200 border border-base-300/30"
            >
              <!-- Icon -->
              <div :class="getActivityIconClass(activity.type)" class="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path v-if="activity.type === 'login'" stroke-linecap="round" stroke-linejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  <path v-else-if="activity.type === 'logout'" stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  <path v-else-if="activity.type === 'create'" stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                  <path v-else-if="activity.type === 'update'" stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-4">
                  <div class="flex-1">
                    <h3 class="font-semibold text-base-content mb-1">{{ activity.action }}</h3>
                    <p class="text-sm text-base-content/70">{{ activity.description }}</p>
                    <div class="flex items-center gap-3 mt-2">
                      <div class="flex items-center gap-1.5 text-xs text-base-content/60">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {{ activity.user }}
                      </div>
                      <div class="flex items-center gap-1.5 text-xs text-base-content/60">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {{ formatDateTime(activity.timestamp) }}
                      </div>
                      <div v-if="activity.ip" class="flex items-center gap-1.5 text-xs text-base-content/60">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        {{ activity.ip }}
                      </div>
                    </div>
                  </div>
                  <div :class="getActivityBadgeClass(activity.type)" class="badge badge-sm shrink-0 capitalize">
                    {{ activity.type }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-16">
            <div class="w-20 h-20 mx-auto mb-6 bg-base-200 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-xl font-bold text-base-content mb-2">No activity found</p>
            <p class="text-sm text-base-content/60">Try adjusting your filters</p>
          </div>

          <!-- Pagination -->
          <div v-if="filteredActivities.length > itemsPerPage" class="flex justify-center mt-8">
            <div class="join">
              <button
                @click="currentPage = Math.max(1, currentPage - 1)"
                :disabled="currentPage === 1"
                class="join-item btn btn-sm"
              >
                «
              </button>
              <button class="join-item btn btn-sm">Page {{ currentPage }} of {{ totalPages }}</button>
              <button
                @click="currentPage = Math.min(totalPages, currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="join-item btn btn-sm"
              >
                »
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Permission Message -->
    <div v-else class="bg-base-100 rounded-2xl shadow-xl border border-base-300/50 overflow-hidden">
      <div class="text-center py-20 px-8">
        <div class="w-24 h-24 mx-auto mb-6 bg-linear-to-br from-error/20 to-warning/20 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold mb-3">Access Restricted</h1>
        <p class="text-base-content/60 mb-8 max-w-md mx-auto">Only administrators can view user activity logs.</p>
        <button @click="router.push('/dashboard')" class="btn btn-primary gap-2 h-12 px-6 shadow-lg hover:shadow-xl transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Go Back
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';

definePageMeta({
  layout: 'dashboard'
});

const router = useRouter();
const { user, isAuthenticated, initAuth } = useAuth();

const loading = ref(false);
const error = ref('');
const searchQuery = ref('');
const eventFilter = ref('');
const userFilter = ref('');
const timeFilter = ref('all');
const currentPage = ref(1);
const itemsPerPage = 10;

// Mock activity data - In production, this would come from an API
const activities = ref([
  {
    id: 1,
    user: 'John Doe',
    type: 'login',
    action: 'User Login',
    description: 'Successfully logged in to the system',
    timestamp: new Date(),
    ip: '192.168.1.1',
  },
  {
    id: 2,
    user: 'Admin User',
    type: 'create',
    action: 'User Created',
    description: 'Created new user account for Jane Smith',
    timestamp: new Date(Date.now() - 3600000),
    ip: '192.168.1.2',
  },
  {
    id: 3,
    user: 'Jane Smith',
    type: 'update',
    action: 'Profile Updated',
    description: 'Updated profile information',
    timestamp: new Date(Date.now() - 7200000),
    ip: '192.168.1.3',
  },
  {
    id: 4,
    user: 'Admin User',
    type: 'delete',
    action: 'User Deleted',
    description: 'Deleted inactive user account',
    timestamp: new Date(Date.now() - 86400000),
    ip: '192.168.1.2',
  },
  {
    id: 5,
    user: 'John Doe',
    type: 'logout',
    action: 'User Logout',
    description: 'Logged out from the system',
    timestamp: new Date(Date.now() - 172800000),
    ip: '192.168.1.1',
  },
  {
    id: 6,
    user: 'Moderator User',
    type: 'update',
    action: 'Role Updated',
    description: 'Updated user role from user to moderator',
    timestamp: new Date(Date.now() - 259200000),
    ip: '192.168.1.4',
  },
  {
    id: 7,
    user: 'Admin User',
    type: 'create',
    action: 'Permission Created',
    description: 'Created new permission: users:manage',
    timestamp: new Date(Date.now() - 345600000),
    ip: '192.168.1.2',
  },
  {
    id: 8,
    user: 'Jane Smith',
    type: 'login',
    action: 'User Login',
    description: 'Successfully logged in to the system',
    timestamp: new Date(Date.now() - 432000000),
    ip: '192.168.1.3',
  },
]);

const isAdmin = computed(() => {
  return user.value?.role === 'admin';
});

const uniqueUsers = computed(() => {
  return [...new Set(activities.value.map(a => a.user))];
});

const filteredActivities = computed(() => {
  let filtered = activities.value;

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((a: any) =>
      a.action.toLowerCase().includes(query) ||
      a.description.toLowerCase().includes(query) ||
      a.user.toLowerCase().includes(query)
    );
  }

  // Filter by event type
  if (eventFilter.value) {
    filtered = filtered.filter((a: any) => a.type === eventFilter.value);
  }

  // Filter by user
  if (userFilter.value) {
    filtered = filtered.filter((a: any) => a.user === userFilter.value);
  }

  // Filter by time range
  if (timeFilter.value !== 'all') {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    filtered = filtered.filter((a: any) => {
      const activityDate = new Date(a.timestamp);
      if (timeFilter.value === 'today') return activityDate >= startOfToday;
      if (timeFilter.value === 'week') return activityDate >= startOfWeek;
      if (timeFilter.value === 'month') return activityDate >= startOfMonth;
      return true;
    });
  }

  return filtered.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
});

const paginatedActivities = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredActivities.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredActivities.value.length / itemsPerPage);
});

const todayActivityCount = computed(() => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return activities.value.filter(a => new Date(a.timestamp) >= startOfToday).length;
});

const weekActivityCount = computed(() => {
  const now = new Date();
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
  return activities.value.filter(a => new Date(a.timestamp) >= startOfWeek).length;
});

const activeUsersCount = computed(() => {
  const oneDayAgo = new Date(Date.now() - 86400000);
  const activeUsers = new Set(
    activities.value
      .filter(a => new Date(a.timestamp) >= oneDayAgo && a.type === 'login')
      .map(a => a.user)
  );
  return activeUsers.size;
});

const getActivityIconClass = (type: string) => {
  const classes = {
    login: 'bg-success/20 text-success',
    logout: 'bg-warning/20 text-warning',
    create: 'bg-primary/20 text-primary',
    update: 'bg-info/20 text-info',
    delete: 'bg-error/20 text-error',
  };
  return classes[type as keyof typeof classes] || 'bg-base-300 text-base-content';
};

const getActivityBadgeClass = (type: string) => {
  const classes = {
    login: 'badge-success',
    logout: 'badge-warning',
    create: 'badge-primary',
    update: 'badge-info',
    delete: 'badge-error',
  };
  return classes[type as keyof typeof classes] || 'badge-ghost';
};

const formatDateTime = (date: any) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;

  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Watch filters and reset to page 1
watch([searchQuery, eventFilter, userFilter, timeFilter], () => {
  currentPage.value = 1;
});

// Redirect if not authenticated
watchEffect(() => {
  if (!isAuthenticated.value) {
    router.push('/login');
  }
});

// Initialize auth on mount
onMounted(() => {
  initAuth();
});
</script>
