<template>
  <div class="min-h-screen bg-base-200">
    <!-- Navigation Bar -->
    <div class="navbar bg-base-100 shadow-lg">
      <div class="navbar-start">
        <label for="my-drawer" class="btn btn-square btn-ghost lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-5 h-5 stroke-current">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </label>
        <div class="flex items-center gap-2">
          <div class="avatar placeholder">
            <div class="bg-primary text-primary-content rounded-lg w-10">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div>
            <h1 class="text-xl font-bold">Dashboard</h1>
            <div class="text-xs breadcrumbs p-0 min-h-0">
              <ul>
                <li>Home</li>
                <li>User Management</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="navbar-end">
        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-circle avatar">
            <div class="avatar placeholder">
              <div class="bg-primary text-primary-content rounded-full w-10">
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
            <li><a>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </a></li>
            <li><a>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </a></li>
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

    <!-- Main Content -->
    <div class="container mx-auto p-4 max-w-7xl">
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

      <!-- Stats -->
      <div v-if="canManageUsers && !loading" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Total Users Card -->
        <div class="relative bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/20 overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div class="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
          <div class="relative flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-base-content/60 mb-2">Total Users</p>
              <h3 class="text-4xl font-bold text-primary mb-1">{{ users.length }}</h3>
              <p class="text-xs text-base-content/50">All registered users</p>
            </div>
            <div class="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 stroke-primary" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Admins Card -->
        <div class="relative bg-gradient-to-br from-error/10 to-error/5 rounded-2xl p-6 border border-error/20 overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div class="absolute top-0 right-0 w-32 h-32 bg-error/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
          <div class="relative flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-base-content/60 mb-2">Admins</p>
              <h3 class="text-4xl font-bold text-error mb-1">{{ users.filter(u => u.role === 'admin').length }}</h3>
              <p class="text-xs text-base-content/50">Full access</p>
            </div>
            <div class="w-12 h-12 bg-error/20 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 stroke-error" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Moderators Card -->
        <div class="relative bg-gradient-to-br from-warning/10 to-warning/5 rounded-2xl p-6 border border-warning/20 overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div class="absolute top-0 right-0 w-32 h-32 bg-warning/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
          <div class="relative flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-base-content/60 mb-2">Moderators</p>
              <h3 class="text-4xl font-bold text-warning mb-1">{{ users.filter(u => u.role === 'moderator').length }}</h3>
              <p class="text-xs text-base-content/50">Can view users</p>
            </div>
            <div class="w-12 h-12 bg-warning/20 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 stroke-warning" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- User Management Section (Admin/Moderator only) -->
      <div v-if="canManageUsers" class="bg-base-100 rounded-2xl shadow-xl border border-base-300/50 overflow-hidden">
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

          <!-- Loading State -->
          <div v-if="loading" class="flex flex-col items-center justify-center py-12">
            <span class="loading loading-spinner loading-lg text-primary"></span>
            <p class="mt-4">Loading users...</p>
          </div>

          <!-- Users Table -->
          <div v-else-if="users.length > 0" class="overflow-x-auto -mx-8">
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
                        <div class="bg-gradient-to-br from-primary to-secondary text-primary-content rounded-full w-10 shadow-md">
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
                <div class="flex-shrink-0 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
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
                  class="flex-shrink-0 w-8 h-8 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center"
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
const router = useRouter();
const { user, isAuthenticated, logout, fetchWithAuth, initAuth } = useAuth();

const users = ref<any[]>([]);
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

const roleBadgeClass = computed(() => {
  const role = user.value?.role;
  if (role === 'admin') return 'badge-error';
  if (role === 'moderator') return 'badge-warning';
  return 'badge-info';
});

const getRoleBadgeClass = (role: string) => {
  if (role === 'admin') return 'badge-error';
  if (role === 'moderator') return 'badge-warning';
  return 'badge-info';
};

const formatDate = (date: any) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
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
    await fetchUsers();
    
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
    await fetchUsers();
    
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
    await fetchUsers();
    
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
    await fetchUsers();
  }
});
</script>
