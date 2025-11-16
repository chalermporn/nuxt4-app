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

    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="success" role="alert" class="alert alert-success mb-6 shadow-lg border-l-4 border-success">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="font-medium">{{ success }}</span>
      </div>
    </Transition>

    <!-- Dashboard Content -->
    <div v-if="canManageUsers && !loading">
      <!-- Welcome Section -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p class="text-base-content/60">
          Welcome back, {{ user?.name }}! Here's what's happening with your system.
        </p>
      </div>

      <!-- Key Metrics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Users -->
        <div class="stat bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20 shadow-lg hover:shadow-xl transition-all">
          <div class="stat-figure text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-8 h-8 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div class="stat-title text-base-content/70">Total Users</div>
          <div class="stat-value text-primary">{{ analytics?.overview?.totalUsers || 0 }}</div>
          <div class="stat-desc text-base-content/60">All registered accounts</div>
        </div>

        <!-- Active Sessions -->
        <div class="stat bg-gradient-to-br from-success/10 to-success/5 rounded-2xl border border-success/20 shadow-lg hover:shadow-xl transition-all">
          <div class="stat-figure text-success">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-8 h-8 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="stat-title text-base-content/70">Active Sessions</div>
          <div class="stat-value text-success">{{ analytics?.overview?.activeSessions || 0 }}</div>
          <div class="stat-desc text-base-content/60">Currently logged in</div>
        </div>

        <!-- New Users Today -->
        <div class="stat bg-gradient-to-br from-warning/10 to-warning/5 rounded-2xl border border-warning/20 shadow-lg hover:shadow-xl transition-all">
          <div class="stat-figure text-warning">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-8 h-8 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div class="stat-title text-base-content/70">New Today</div>
          <div class="stat-value text-warning">{{ analytics?.overview?.newUsersToday || 0 }}</div>
          <div class="stat-desc text-base-content/60">Joined in last 24h</div>
        </div>

        <!-- Growth This Week -->
        <div class="stat bg-gradient-to-br from-info/10 to-info/5 rounded-2xl border border-info/20 shadow-lg hover:shadow-xl transition-all">
          <div class="stat-figure text-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-8 h-8 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div class="stat-title text-base-content/70">This Week</div>
          <div class="stat-value text-info">{{ analytics?.overview?.newUsersThisWeek || 0 }}</div>
          <div class="stat-desc text-base-content/60">New users this week</div>
        </div>
      </div>

      <!-- Charts and Analytics Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- User Growth Trend Chart -->
        <div class="bg-base-100 rounded-2xl shadow-xl border border-base-300/50 p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-xl font-bold mb-1">User Growth Trend</h3>
              <p class="text-sm text-base-content/60">Last 7 days registration</p>
            </div>
            <div class="badge badge-primary badge-lg">
              {{ analytics?.overview?.newUsersThisWeek || 0 }} this week
            </div>
          </div>

          <div class="relative h-64">
            <div v-if="analytics?.growthTrend?.length" class="flex items-end justify-between h-full gap-2">
              <div
                v-for="(day, index) in analytics.growthTrend"
                :key="index"
                class="flex-1 flex flex-col items-center gap-2 group"
              >
                <div class="relative w-full flex items-end justify-center h-full">
                  <div
                    class="w-full bg-gradient-to-t from-primary to-primary/50 rounded-t-lg transition-all group-hover:from-primary/80 group-hover:to-primary/30 cursor-pointer relative"
                    :style="{ height: `${getBarHeight(day.count)}%` }"
                  >
                    <div class="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      {{ day.count }}
                    </div>
                  </div>
                </div>
                <div class="text-xs text-base-content/60 mt-2">
                  {{ formatShortDate(day.date) }}
                </div>
              </div>
            </div>
            <div v-else class="flex items-center justify-center h-full text-base-content/40">
              No growth data available
            </div>
          </div>
        </div>

        <!-- Role Distribution -->
        <div class="bg-base-100 rounded-2xl shadow-xl border border-base-300/50 p-6">
          <div class="mb-6">
            <h3 class="text-xl font-bold mb-1">Role Distribution</h3>
            <p class="text-sm text-base-content/60">User roles breakdown</p>
          </div>

          <div class="space-y-4">
            <div
              v-for="role in analytics?.roleDistribution"
              :key="role.role"
              class="space-y-2"
            >
              <div class="flex items-center justify-between text-sm">
                <div class="flex items-center gap-2">
                  <div :class="getRoleColor(role.role)" class="w-3 h-3 rounded-full"></div>
                  <span class="font-medium capitalize">{{ role.role }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <span class="text-base-content/60">{{ role.count }} users</span>
                  <span class="font-bold text-primary">{{ role.percentage }}%</span>
                </div>
              </div>
              <div class="w-full bg-base-300 rounded-full h-2.5">
                <div
                  :class="getRoleGradient(role.role)"
                  class="h-2.5 rounded-full transition-all duration-500"
                  :style="{ width: `${role.percentage}%` }"
                ></div>
              </div>
            </div>

            <!-- Role Legend -->
            <div class="pt-4 border-t border-base-300 grid grid-cols-3 gap-2">
              <div
                v-for="role in analytics?.roleDistribution"
                :key="role.role"
                class="flex items-center gap-2"
              >
                <div :class="getRoleBadgeClass(role.role)" class="badge badge-sm">
                  {{ role.role }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Users & Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Recent Users -->
        <div class="bg-base-100 rounded-2xl shadow-xl border border-base-300/50 overflow-hidden">
          <div class="p-6 border-b border-base-300">
            <h3 class="text-xl font-bold mb-1">Recent Users</h3>
            <p class="text-sm text-base-content/60">Latest registered members</p>
          </div>
          <div class="divide-y divide-base-300">
            <div
              v-for="recentUser in analytics?.recentUsers?.slice(0, 5)"
              :key="recentUser.id"
              class="p-4 hover:bg-base-200/50 transition-colors"
            >
              <div class="flex items-center gap-3">
                <div class="avatar placeholder">
                  <div class="bg-gradient-to-br from-primary to-secondary text-primary-content rounded-full w-10">
                    <span class="text-xs font-semibold">{{ recentUser.name?.charAt(0).toUpperCase() }}</span>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-semibold truncate">{{ recentUser.name }}</div>
                  <div class="text-sm text-base-content/60 truncate">{{ recentUser.email }}</div>
                </div>
                <div class="text-right">
                  <div :class="getRoleBadgeClass(recentUser.role)" class="badge badge-sm mb-1">
                    {{ recentUser.role }}
                  </div>
                  <div class="text-xs text-base-content/50">
                    {{ formatRelativeDate(recentUser.createdAt) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- System Health -->
        <div class="bg-base-100 rounded-2xl shadow-xl border border-base-300/50 overflow-hidden">
          <div class="p-6 border-b border-base-300">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-bold mb-1">System Health</h3>
                <p class="text-sm text-base-content/60">Current system status</p>
              </div>
              <div class="badge badge-success badge-lg gap-2">
                <div class="w-2 h-2 bg-success-content rounded-full animate-pulse"></div>
                Healthy
              </div>
            </div>
          </div>
          <div class="p-6 space-y-4">
            <!-- Active vs Total Users -->
            <div class="flex items-center justify-between p-4 bg-base-200 rounded-xl">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div class="text-sm text-base-content/60">Active Rate</div>
                  <div class="font-bold">{{ getActiveRate() }}%</div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-sm text-base-content/60">Sessions</div>
                <div class="font-semibold">{{ analytics?.overview?.activeSessions }} / {{ analytics?.overview?.totalUsers }}</div>
              </div>
            </div>

            <!-- Growth This Month -->
            <div class="flex items-center justify-between p-4 bg-base-200 rounded-xl">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-info/20 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <div class="text-sm text-base-content/60">Monthly Growth</div>
                  <div class="font-bold">{{ analytics?.overview?.newUsersThisMonth || 0 }} users</div>
                </div>
              </div>
              <div class="badge badge-info">This Month</div>
            </div>

            <!-- Quick Stats -->
            <div class="grid grid-cols-2 gap-3">
              <div class="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <div class="text-xs text-base-content/60 mb-1">Admins</div>
                <div class="text-2xl font-bold text-primary">
                  {{ analytics?.roleDistribution?.find(r => r.role === 'admin')?.count || 0 }}
                </div>
              </div>
              <div class="p-3 bg-warning/5 border border-warning/20 rounded-lg">
                <div class="text-xs text-base-content/60 mb-1">Moderators</div>
                <div class="text-2xl font-bold text-warning">
                  {{ analytics?.roleDistribution?.find(r => r.role === 'moderator')?.count || 0 }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- User Management Section -->
      <div class="bg-base-100 rounded-2xl shadow-xl border border-base-300/50 overflow-hidden hidden">
        <div class="p-8">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 class="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">User Management</h2>
              <p class="text-sm text-base-content/60">Manage your team members and permissions</p>
            </div>
            <button
              v-if="user?.role === 'admin'"
              @click="showCreateModal = true"
              class="btn btn-primary gap-2 shadow-lg hover:shadow-xl transition-all h-12 px-6"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add User
            </button>
          </div>

          <!-- Users Table -->
          <div v-if="users.length > 0" class="overflow-x-auto -mx-8">
            <table class="table">
              <thead>
                <tr class="border-b border-base-300">
                  <th class="bg-base-200/50 font-semibold">ID</th>
                  <th class="bg-base-200/50 font-semibold">User</th>
                  <th class="bg-base-200/50 font-semibold">Email</th>
                  <th class="bg-base-200/50 font-semibold">Role</th>
                  <th class="bg-base-200/50 font-semibold">Joined</th>
                  <th v-if="user?.role === 'admin'" class="bg-base-200/50 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="u in users" :key="u.id" class="hover:bg-base-200/30 transition-colors border-b border-base-200/50">
                  <td class="font-mono text-sm text-base-content/60">{{ u.id }}</td>
                  <td>
                    <div class="flex items-center gap-3">
                      <div class="avatar placeholder">
                        <div class="bg-gradient-to-br from-primary to-secondary text-primary-content rounded-full w-10 shadow-md flex items-center justify-center">
                          <span class="text-xs font-semibold">{{ u.name?.charAt(0).toUpperCase() }}</span>
                        </div>
                      </div>
                      <div class="font-semibold">{{ u.name }}</div>
                    </div>
                  </td>
                  <td class="text-base-content/70">{{ u.email }}</td>
                  <td>
                    <div :class="getRoleBadgeClass(u.role)" class="badge badge-sm font-medium">{{ u.role }}</div>
                  </td>
                  <td class="text-base-content/60 text-sm">{{ formatDate(u.createdAt) }}</td>
                  <td v-if="user?.role === 'admin'" class="text-right">
                    <div class="inline-flex gap-2">
                      <button
                        @click="editUser(u)"
                        class="btn btn-sm btn-ghost hover:btn-primary group"
                        title="Edit user"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        @click="deleteUser(u.id)"
                        :disabled="u.id === user?.id"
                        class="btn btn-sm btn-ghost hover:btn-error group disabled:opacity-30"
                        title="Delete user"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="text-center py-16">
            <div class="w-20 h-20 mx-auto mb-6 bg-base-200 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p class="text-xl font-bold text-base-content mb-2">No users found</p>
            <p class="text-sm text-base-content/60">Start by adding your first user</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else-if="loading" class="flex flex-col items-center justify-center py-20">
      <span class="loading loading-spinner loading-lg text-primary"></span>
      <p class="mt-4 text-base-content/60">Loading dashboard...</p>
    </div>

    <!-- No Permission Message -->
    <div v-else class="bg-base-100 rounded-2xl shadow-xl border border-base-300/50 overflow-hidden">
      <div class="text-center py-20 px-8">
        <div class="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-error/20 to-warning/20 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold mb-3">Access Restricted</h1>
        <p class="text-base-content/60 mb-8 max-w-md mx-auto">You don't have permission to manage users. Contact your administrator for access.</p>
        <button @click="handleLogout" class="btn btn-primary gap-2 h-12 px-6 shadow-lg hover:shadow-xl transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Return to Login
        </button>
      </div>
    </div>

    <!-- Create/Edit User Modal -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showCreateModal || showEditModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="closeModal"
      >
        <!-- Backdrop with blur -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeModal"></div>

        <!-- Modal Content -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div
            v-if="showCreateModal || showEditModal"
            class="relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden bg-white backdrop-blur-md border border-base-300/30"
          >
            <!-- Gradient Header -->
            <div class="relative bg-gradient-to-br from-primary to-secondary p-8 text-primary-content overflow-hidden">
              <!-- Decorative circles -->
              <div class="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div class="absolute -bottom-4 -left-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>

              <div class="relative flex items-start gap-4">
                <div class="shrink-0 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div class="flex-1">
                  <h3 class="text-2xl font-bold mb-1">{{ showEditModal ? 'Edit User' : 'Create New User' }}</h3>
                  <p class="text-sm opacity-90">{{ showEditModal ? 'Update user information below' : 'Fill in the details to add a new user' }}</p>
                </div>
                <button
                  @click="closeModal"
                  type="button"
                  class="shrink-0 w-8 h-8 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Form -->
            <form @submit.prevent="showEditModal ? handleUpdate() : handleCreate()" class="p-8 space-y-6">
              <!-- Name Field -->
              <div class="space-y-2">
                <label class="block">
                  <span class="text-sm font-semibold text-base-content flex items-center gap-2">
                    Full Name
                    <span class="text-error text-xs">*</span>
                  </span>
                </label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/40 group-focus-within:text-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    v-model="formData.name"
                    type="text"
                    required
                    placeholder="Enter full name"
                    class="input input-bordered w-full pl-12 pr-4 h-12 focus:input-primary transition-all"
                  />
                </div>
              </div>

              <!-- Email Field -->
              <div class="space-y-2">
                <label class="block">
                  <span class="text-sm font-semibold text-base-content flex items-center gap-2">
                    Email Address
                    <span class="text-error text-xs">*</span>
                  </span>
                </label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/40 group-focus-within:text-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    v-model="formData.email"
                    type="email"
                    required
                    placeholder="user@example.com"
                    class="input input-bordered w-full pl-12 pr-4 h-12 focus:input-primary transition-all"
                  />
                </div>
              </div>

              <!-- Password Field -->
              <div class="space-y-2">
                <label class="block">
                  <span class="text-sm font-semibold text-base-content flex items-center gap-2">
                    Password
                    <span v-if="!showEditModal" class="text-error text-xs">*</span>
                    <span v-else class="text-xs text-base-content/60 font-normal">(Optional)</span>
                  </span>
                </label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/40 group-focus-within:text-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    v-model="formData.password"
                    type="password"
                    :required="!showEditModal"
                    minlength="6"
                    :placeholder="showEditModal ? 'Leave blank to keep current' : 'Minimum 6 characters'"
                    class="input input-bordered w-full pl-12 pr-4 h-12 focus:input-primary transition-all"
                  />
                </div>
                <p class="text-xs text-base-content/60">
                  {{ showEditModal ? 'Leave blank to keep current password' : 'Minimum 6 characters required' }}
                </p>
              </div>

              <!-- Role Field -->
              <div class="space-y-2">
                <label class="block">
                  <span class="text-sm font-semibold text-base-content flex items-center gap-2">
                    User Role
                    <span class="text-error text-xs">*</span>
                  </span>
                </label>
                <select
                  v-model="formData.role"
                  class="select select-bordered w-full h-12 focus:select-primary transition-all bg-white"
                  required
                >
                  <option disabled value="">Select a role</option>
                  <option value="user">User - Standard access</option>
                  <option value="moderator">Moderator - Can view and manage users</option>
                  <option value="admin">Admin - Full system access</option>
                </select>
                <p class="text-xs text-base-content/60">
                  Select the appropriate role for this user
                </p>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-3 pt-4">
                <button
                  type="button"
                  @click="closeModal"
                  class="btn btn-ghost flex-1 h-12 hover:bg-base-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="modalLoading"
                  class="btn btn-primary flex-1 h-12 gap-2 shadow-lg hover:shadow-xl transition-all"
                >
                  <span v-if="modalLoading" class="loading loading-spinner loading-sm"></span>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {{ modalLoading ? 'Processing...' : (showEditModal ? 'Update' : 'Create') }}
                </button>
              </div>
            </form>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';

definePageMeta({
  layout: 'dashboard'
});

const router = useRouter();
const { user, isAuthenticated, logout, fetchWithAuth, initAuth } = useAuth();

const users = ref<any[]>([]);
const analytics = ref<any>(null);
const loading = ref(false);
const modalLoading = ref(false);
const error = ref('');
const success = ref('');
const showCreateModal = ref(false);
const showEditModal = ref(false);
const editingUserId = ref<number | null>(null);

const formData = reactive({
  name: '',
  email: '',
  password: '',
  role: 'user',
});

const canManageUsers = computed(() => {
  return user.value?.role === 'admin' || user.value?.role === 'moderator';
});

const getRoleBadgeClass = (role: string) => {
  if (role === 'admin') return 'badge-error';
  if (role === 'moderator') return 'badge-warning';
  return 'badge-info';
};

const getRoleColor = (role: string) => {
  if (role === 'admin') return 'bg-error';
  if (role === 'moderator') return 'bg-warning';
  return 'bg-info';
};

const getRoleGradient = (role: string) => {
  if (role === 'admin') return 'bg-gradient-to-r from-error to-error/70';
  if (role === 'moderator') return 'bg-gradient-to-r from-warning to-warning/70';
  return 'bg-gradient-to-r from-info to-info/70';
};

const formatDate = (date: any) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatShortDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatRelativeDate = (date: any) => {
  if (!date) return 'N/A';
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
};

const getBarHeight = (count: number) => {
  if (!analytics.value?.growthTrend) return 0;
  const maxCount = Math.max(...analytics.value.growthTrend.map((d: any) => d.count), 1);
  return (count / maxCount) * 100;
};

const getActiveRate = () => {
  if (!analytics.value?.overview) return 0;
  const total = analytics.value.overview.totalUsers || 1;
  const active = analytics.value.overview.activeSessions || 0;
  return ((active / total) * 100).toFixed(1);
};

const fetchAnalytics = async () => {
  try {
    const response = await fetchWithAuth<any>('http://localhost:3001/api/analytics/dashboard');
    analytics.value = response;
  } catch (err: any) {
    console.error('Failed to fetch analytics:', err);
  }
};

const fetchUsers = async () => {
  loading.value = true;
  error.value = '';

  try {
    const response = await fetchWithAuth<{ users: any[] }>('http://localhost:3001/api/users');
    users.value = response.users;
  } catch (err: any) {
    error.value = err.message || 'Failed to fetch users';
  } finally {
    loading.value = false;
  }
};

const handleCreate = async () => {
  modalLoading.value = true;
  error.value = '';

  try {
    await fetchWithAuth('http://localhost:3001/api/users', {
      method: 'POST',
      body: {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      },
    });

    success.value = 'User created successfully';
    closeModal();
    await Promise.all([fetchUsers(), fetchAnalytics()]);

    setTimeout(() => {
      success.value = '';
    }, 3000);
  } catch (err: any) {
    error.value = err.message || 'Failed to create user';
  } finally {
    modalLoading.value = false;
  }
};

const editUser = (u: any) => {
  editingUserId.value = u.id;
  formData.name = u.name;
  formData.email = u.email;
  formData.password = '';
  formData.role = u.role;
  showEditModal.value = true;
};

const handleUpdate = async () => {
  if (!editingUserId.value) return;

  modalLoading.value = true;
  error.value = '';

  try {
    const body: any = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
    };

    if (formData.password) {
      body.password = formData.password;
    }

    await fetchWithAuth(`http://localhost:3001/api/users/${editingUserId.value}`, {
      method: 'PATCH',
      body,
    });

    success.value = 'User updated successfully';
    closeModal();
    await Promise.all([fetchUsers(), fetchAnalytics()]);

    setTimeout(() => {
      success.value = '';
    }, 3000);
  } catch (err: any) {
    error.value = err.message || 'Failed to update user';
  } finally {
    modalLoading.value = false;
  }
};

const deleteUser = async (id: number) => {
  if (!confirm('Are you sure you want to delete this user?')) return;

  error.value = '';

  try {
    await fetchWithAuth(`http://localhost:3001/api/users/${id}`, {
      method: 'DELETE',
    });

    success.value = 'User deleted successfully';
    await Promise.all([fetchUsers(), fetchAnalytics()]);

    setTimeout(() => {
      success.value = '';
    }, 3000);
  } catch (err: any) {
    error.value = err.message || 'Failed to delete user';
  }
};

const closeModal = () => {
  showCreateModal.value = false;
  showEditModal.value = false;
  editingUserId.value = null;
  formData.name = '';
  formData.email = '';
  formData.password = '';
  formData.role = 'user';
};

const handleLogout = async () => {
  await logout();
  router.push('/login');
};

// Redirect if not authenticated
watchEffect(() => {
  if (!isAuthenticated.value) {
    router.push('/login');
  }
});

// Initialize and fetch data
onMounted(async () => {
  initAuth();

  // Wait a bit for auth to initialize
  await nextTick();

  if (isAuthenticated.value && canManageUsers.value) {
    await Promise.all([fetchUsers(), fetchAnalytics()]);
  }
});
</script>
