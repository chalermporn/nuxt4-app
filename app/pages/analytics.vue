<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center flex-wrap gap-4">
      <div>
        <h1 class="text-3xl font-bold">Analytics</h1>
        <p class="text-base-content/60 mt-1">Monitor your system metrics and performance</p>
      </div>
      <div class="flex gap-2">
        <select v-model="timeRange" class="select select-bordered">
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="1y">Last Year</option>
        </select>
        <button class="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export
        </button>
      </div>
    </div>

    <!-- Key Metrics Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="stats shadow bg-base-100">
        <div class="stat">
          <div class="stat-figure text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div class="stat-title">Total Users</div>
          <div class="stat-value text-primary">{{ metrics.totalUsers }}</div>
          <div class="stat-desc">
            <span class="text-success">↗︎ {{ metrics.usersGrowth }}%</span> this period
          </div>
        </div>
      </div>

      <div class="stats shadow bg-base-100">
        <div class="stat">
          <div class="stat-figure text-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <div class="stat-title">Page Views</div>
          <div class="stat-value text-secondary">{{ formatNumber(metrics.pageViews) }}</div>
          <div class="stat-desc">
            <span class="text-success">↗︎ {{ metrics.pageViewsGrowth }}%</span> from last period
          </div>
        </div>
      </div>

      <div class="stats shadow bg-base-100">
        <div class="stat">
          <div class="stat-figure text-accent">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div class="stat-title">Active Sessions</div>
          <div class="stat-value text-accent">{{ metrics.activeSessions }}</div>
          <div class="stat-desc">Currently online</div>
        </div>
      </div>

      <div class="stats shadow bg-base-100">
        <div class="stat">
          <div class="stat-figure text-info">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="stat-title">Avg. Session</div>
          <div class="stat-value text-info">{{ metrics.avgSession }}m</div>
          <div class="stat-desc">Average duration</div>
        </div>
      </div>
    </div>

    <!-- Charts Row 1 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- User Growth Chart -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">User Growth</h2>
          <div class="h-64 flex items-center justify-center border-2 border-dashed border-base-300 rounded-lg">
            <div class="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-base-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              <p class="text-base-content/60 mt-2">Line Chart Placeholder</p>
              <p class="text-sm text-base-content/40">Integrate Chart.js or similar</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Traffic Sources -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Traffic Sources</h2>
          <div class="h-64 flex items-center justify-center border-2 border-dashed border-base-300 rounded-lg">
            <div class="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-base-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
              <p class="text-base-content/60 mt-2">Pie Chart Placeholder</p>
              <p class="text-sm text-base-content/40">Integrate Chart.js or similar</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Traffic Sources Table -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">Page Performance</h2>
            <div class="overflow-x-auto">
              <table class="table">
                <thead>
                  <tr>
                    <th>Page</th>
                    <th>Views</th>
                    <th>Avg. Time</th>
                    <th>Bounce Rate</th>
                    <th>Trend</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="page in pagePerformance" :key="page.path">
                    <td>
                      <div class="font-bold">{{ page.name }}</div>
                      <div class="text-sm opacity-50">{{ page.path }}</div>
                    </td>
                    <td>{{ formatNumber(page.views) }}</td>
                    <td>{{ page.avgTime }}</td>
                    <td>
                      <div class="badge" :class="page.bounceRate > 70 ? 'badge-error' : page.bounceRate > 50 ? 'badge-warning' : 'badge-success'">
                        {{ page.bounceRate }}%
                      </div>
                    </td>
                    <td>
                      <span :class="page.trend > 0 ? 'text-success' : 'text-error'">
                        {{ page.trend > 0 ? '↗︎' : '↘︎' }} {{ Math.abs(page.trend) }}%
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Referrers -->
      <div class="lg:col-span-1">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">Top Referrers</h2>
            <div class="space-y-4">
              <div v-for="referrer in topReferrers" :key="referrer.source" class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="avatar placeholder">
                    <div class="bg-neutral text-neutral-content rounded w-10">
                      <span class="text-xs">{{ referrer.source.charAt(0).toUpperCase() }}</span>
                    </div>
                  </div>
                  <div>
                    <div class="font-bold">{{ referrer.source }}</div>
                    <div class="text-sm opacity-50">{{ referrer.visits }} visits</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="font-bold">{{ referrer.percentage }}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Device Stats -->
        <div class="card bg-base-100 shadow-xl mt-6">
          <div class="card-body">
            <h2 class="card-title">Device Breakdown</h2>
            <div class="space-y-3">
              <div v-for="device in deviceStats" :key="device.type">
                <div class="flex justify-between text-sm mb-1">
                  <span class="flex items-center gap-2">
                    <component :is="getDeviceIcon(device.type)" class="h-4 w-4" />
                    {{ device.type }}
                  </span>
                  <span class="font-bold">{{ device.percentage }}%</span>
                </div>
                <progress class="progress progress-primary" :value="device.percentage" max="100"></progress>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- User Activity Chart -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="flex justify-between items-center mb-4">
          <h2 class="card-title">User Activity Heatmap</h2>
          <div class="text-sm text-base-content/60">Peak hours: 10AM - 4PM</div>
        </div>
        <div class="h-96 flex items-center justify-center border-2 border-dashed border-base-300 rounded-lg">
          <div class="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-base-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p class="text-base-content/60 mt-2">Heatmap Chart Placeholder</p>
            <p class="text-sm text-base-content/40">Shows hourly activity patterns</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Real-time Activity -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="flex justify-between items-center mb-4">
          <h2 class="card-title">
            Real-time Activity
            <div class="badge badge-success badge-sm gap-1">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
              Live
            </div>
          </h2>
        </div>
        <div class="overflow-x-auto">
          <table class="table table-zebra">
            <thead>
              <tr>
                <th>Time</th>
                <th>User</th>
                <th>Action</th>
                <th>Page</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="activity in realtimeActivity" :key="activity.id">
                <td class="text-sm">{{ activity.time }}</td>
                <td>
                  <div class="flex items-center gap-2">
                    <div class="avatar placeholder">
                      <div class="bg-neutral text-neutral-content rounded-full w-8">
                        <span class="text-xs">{{ activity.user.charAt(0) }}</span>
                      </div>
                    </div>
                    <span>{{ activity.user }}</span>
                  </div>
                </td>
                <td>
                  <div class="badge badge-outline">{{ activity.action }}</div>
                </td>
                <td class="text-sm">{{ activity.page }}</td>
                <td class="text-sm">{{ activity.location }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
});

const timeRange = ref('7d');

// Mock data - In production, fetch from API
const metrics = ref({
  totalUsers: 2547,
  usersGrowth: 12.5,
  pageViews: 48392,
  pageViewsGrowth: 8.3,
  activeSessions: 342,
  avgSession: 24
});

const pagePerformance = ref([
  { name: 'Dashboard', path: '/dashboard', views: 15420, avgTime: '3:24', bounceRate: 32, trend: 5.2 },
  { name: 'User Management', path: '/user-management', views: 8934, avgTime: '4:12', bounceRate: 28, trend: 12.4 },
  { name: 'Analytics', path: '/analytics', views: 7821, avgTime: '5:38', bounceRate: 45, trend: -2.1 },
  { name: 'Reports', path: '/reports', views: 6543, avgTime: '6:15', bounceRate: 38, trend: 8.7 },
  { name: 'Settings', path: '/settings', views: 4201, avgTime: '2:45', bounceRate: 52, trend: 3.4 }
]);

const topReferrers = ref([
  { source: 'Google', visits: 12543, percentage: 45 },
  { source: 'Direct', visits: 8234, percentage: 30 },
  { source: 'Facebook', visits: 3892, percentage: 14 },
  { source: 'Twitter', visits: 2104, percentage: 8 },
  { source: 'LinkedIn', visits: 834, percentage: 3 }
]);

const deviceStats = ref([
  { type: 'Desktop', percentage: 58 },
  { type: 'Mobile', percentage: 32 },
  { type: 'Tablet', percentage: 10 }
]);

const realtimeActivity = ref([
  { id: 1, time: '2 sec ago', user: 'John Doe', action: 'Page View', page: '/dashboard', location: 'Bangkok, TH' },
  { id: 2, time: '5 sec ago', user: 'Jane Smith', action: 'Login', page: '/login', location: 'Tokyo, JP' },
  { id: 3, time: '12 sec ago', user: 'Bob Wilson', action: 'Edit', page: '/user-management', location: 'New York, US' },
  { id: 4, time: '18 sec ago', user: 'Alice Brown', action: 'Page View', page: '/analytics', location: 'London, UK' },
  { id: 5, time: '23 sec ago', user: 'Charlie Davis', action: 'Download', page: '/reports', location: 'Sydney, AU' }
]);

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

const getDeviceIcon = (type: string) => {
  const icons: Record<string, string> = {
    Desktop: 'svg',
    Mobile: 'svg',
    Tablet: 'svg'
  };
  return icons[type] || 'svg';
};

// Simulate real-time updates
onMounted(() => {
  const interval = setInterval(() => {
    // Update real-time activity
    const newActivity = {
      id: Date.now(),
      time: 'just now',
      user: ['John', 'Jane', 'Bob', 'Alice', 'Charlie'][Math.floor(Math.random() * 5)] + ' ' +
            ['Doe', 'Smith', 'Wilson', 'Brown', 'Davis'][Math.floor(Math.random() * 5)],
      action: ['Page View', 'Login', 'Edit', 'Download', 'Upload'][Math.floor(Math.random() * 5)],
      page: ['/dashboard', '/analytics', '/reports', '/settings', '/user-management'][Math.floor(Math.random() * 5)],
      location: ['Bangkok, TH', 'Tokyo, JP', 'New York, US', 'London, UK', 'Sydney, AU'][Math.floor(Math.random() * 5)]
    };
    
    realtimeActivity.value = [newActivity, ...realtimeActivity.value.slice(0, 4)];
    
    // Update time for existing activities
    realtimeActivity.value = realtimeActivity.value.map((activity, index) => ({
      ...activity,
      time: index === 0 ? 'just now' : `${(index + 1) * 5} sec ago`
    }));
  }, 5000);

  onUnmounted(() => clearInterval(interval));
});
</script>
