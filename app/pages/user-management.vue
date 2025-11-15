<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            User Management
          </h1>
          <p class="text-base-content/60">
            Complete user administration with advanced filtering
          </p>
        </div>
        <button
          v-if="user?.role === 'admin'"
          @click="openCreateModal"
          class="btn btn-primary gap-2 shadow-lg hover:shadow-xl transition-all h-12 px-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add User
        </button>
      </div>
    </div>

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

    <!-- Stats Cards -->
    <div v-if="!loading" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="stat bg-base-100 rounded-xl border border-base-300/50 shadow-md">
        <div class="stat-title text-sm">Total Users</div>
        <div class="stat-value text-2xl text-primary">{{ filteredUsers.length }}</div>
        <div class="stat-desc">{{ users.length }} total</div>
      </div>
      <div class="stat bg-base-100 rounded-xl border border-base-300/50 shadow-md">
        <div class="stat-title text-sm">Admins</div>
        <div class="stat-value text-2xl text-error">{{ users.filter(u => u.role === 'admin').length }}</div>
        <div class="stat-desc">Full access</div>
      </div>
      <div class="stat bg-base-100 rounded-xl border border-base-300/50 shadow-md">
        <div class="stat-title text-sm">Moderators</div>
        <div class="stat-value text-2xl text-warning">{{ users.filter(u => u.role === 'moderator').length }}</div>
        <div class="stat-desc">Limited access</div>
      </div>
      <div class="stat bg-base-100 rounded-xl border border-base-300/50 shadow-md">
        <div class="stat-title text-sm">Regular Users</div>
        <div class="stat-value text-2xl text-info">{{ users.filter(u => u.role === 'user').length }}</div>
        <div class="stat-desc">Standard access</div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="bg-base-100 rounded-2xl shadow-xl border border-base-300/50 overflow-hidden">
      <!-- Search and Filter Bar -->
      <div class="p-6 bg-base-200/50 border-b border-base-300">
        <div class="flex flex-col lg:flex-row gap-4">
          <!-- Search -->
          <div class="flex-1">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by name or email..."
                class="input input-bordered w-full pl-12 h-12"
              />
            </div>
          </div>

          <!-- Role Filter -->
          <div class="w-full lg:w-48">
            <select v-model="roleFilter" class="select select-bordered w-full h-12">
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
              <option value="user">User</option>
            </select>
          </div>

          <!-- Sort By -->
          <div class="w-full lg:w-48">
            <select v-model="sortBy" class="select select-bordered w-full h-12">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>
          </div>

          <!-- Clear Filters -->
          <button
            v-if="searchQuery || roleFilter"
            @click="clearFilters"
            class="btn btn-ghost h-12 gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear
          </button>
        </div>

        <!-- Active Filters -->
        <div v-if="searchQuery || roleFilter" class="flex flex-wrap gap-2 mt-4">
          <div v-if="searchQuery" class="badge badge-primary gap-2">
            <span>Search: {{ searchQuery }}</span>
            <button @click="searchQuery = ''" class="hover:text-error">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div v-if="roleFilter" class="badge badge-secondary gap-2">
            <span>Role: {{ roleFilter }}</span>
            <button @click="roleFilter = ''" class="hover:text-error">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <span class="loading loading-spinner loading-lg text-primary"></span>
        <p class="mt-4 text-base-content/60">Loading users...</p>
      </div>

      <!-- Users Table -->
      <div v-else-if="paginatedUsers.length > 0" class="overflow-x-auto">
        <table class="table table-zebra">
          <thead class="bg-base-200">
            <tr>
              <th class="font-semibold">
                <label>
                  <input
                    type="checkbox"
                    class="checkbox checkbox-sm"
                    :checked="selectedUsers.length === paginatedUsers.length"
                    @change="toggleSelectAll"
                  />
                </label>
              </th>
              <th class="font-semibold">ID</th>
              <th class="font-semibold">User</th>
              <th class="font-semibold">Email</th>
              <th class="font-semibold">Role</th>
              <th class="font-semibold">Joined</th>
              <th class="font-semibold">Updated</th>
              <th v-if="user?.role === 'admin'" class="font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="u in paginatedUsers"
              :key="u.id"
              class="hover transition-colors"
              :class="{ 'bg-primary/5': selectedUsers.includes(u.id) }"
            >
              <th>
                <label>
                  <input
                    type="checkbox"
                    class="checkbox checkbox-sm"
                    :checked="selectedUsers.includes(u.id)"
                    @change="toggleSelect(u.id)"
                  />
                </label>
              </th>
              <td class="font-mono text-sm text-base-content/60">#{{ u.id }}</td>
              <td>
                <div class="flex items-center gap-3">
                  <div class="avatar placeholder">
                    <div class="bg-gradient-to-br from-primary to-secondary text-primary-content rounded-full w-10">
                      <span class="text-xs font-semibold">{{ u.name?.charAt(0).toUpperCase() }}</span>
                    </div>
                  </div>
                  <div>
                    <div class="font-semibold">{{ u.name }}</div>
                  </div>
                </div>
              </td>
              <td class="text-base-content/70">{{ u.email }}</td>
              <td>
                <div :class="getRoleBadgeClass(u.role)" class="badge badge-sm font-medium capitalize">
                  {{ u.role }}
                </div>
              </td>
              <td class="text-sm text-base-content/60">{{ formatDate(u.createdAt) }}</td>
              <td class="text-sm text-base-content/60">{{ formatDate(u.updatedAt) }}</td>
              <td v-if="user?.role === 'admin'" class="text-right">
                <div class="flex justify-end gap-2">
                  <button
                    @click="viewUser(u)"
                    class="btn btn-sm btn-ghost tooltip tooltip-left"
                    data-tip="View details"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    @click="editUser(u)"
                    class="btn btn-sm btn-ghost hover:btn-primary tooltip tooltip-left"
                    data-tip="Edit user"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="deleteUser(u.id)"
                    :disabled="u.id === user?.id"
                    class="btn btn-sm btn-ghost hover:btn-error tooltip tooltip-left disabled:opacity-30"
                    data-tip="Delete user"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <div class="w-20 h-20 mx-auto mb-6 bg-base-200 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <p class="text-xl font-bold text-base-content mb-2">No users found</p>
        <p class="text-sm text-base-content/60 mb-4">
          {{ searchQuery || roleFilter ? 'Try adjusting your filters' : 'Start by adding your first user' }}
        </p>
        <button v-if="searchQuery || roleFilter" @click="clearFilters" class="btn btn-primary">
          Clear Filters
        </button>
      </div>

      <!-- Pagination -->
      <div v-if="filteredUsers.length > itemsPerPage" class="p-6 border-t border-base-300 bg-base-200/30">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div class="text-sm text-base-content/60">
            Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredUsers.length) }} of {{ filteredUsers.length }} users
          </div>

          <div class="flex gap-2">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="btn btn-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <div class="flex gap-1">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="currentPage = page"
                class="btn btn-sm"
                :class="{ 'btn-primary': currentPage === page }"
              >
                {{ page }}
              </button>
            </div>

            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="btn btn-sm"
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div class="flex items-center gap-2">
            <label class="text-sm text-base-content/60">Per page:</label>
            <select v-model.number="itemsPerPage" class="select select-sm select-bordered">
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Bulk Actions -->
      <div v-if="selectedUsers.length > 0" class="p-4 bg-primary/10 border-t border-primary/20">
        <div class="flex items-center justify-between">
          <div class="text-sm font-semibold">
            {{ selectedUsers.length }} user{{ selectedUsers.length > 1 ? 's' : '' }} selected
          </div>
          <div class="flex gap-2">
            <button @click="selectedUsers = []" class="btn btn-sm btn-ghost">
              Clear Selection
            </button>
            <button
              v-if="user?.role === 'admin'"
              @click="bulkDelete"
              class="btn btn-sm btn-error gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Selected
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- View User Modal -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showViewModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="showViewModal = false"
      >
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showViewModal = false"></div>

        <div class="relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden bg-base-100 border border-base-300/30">
          <!-- Header -->
          <div class="relative bg-gradient-to-br from-primary to-secondary p-8 text-primary-content">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="text-2xl font-bold mb-1">User Details</h3>
                <p class="text-sm opacity-90">Complete user information</p>
              </div>
              <button
                @click="showViewModal = false"
                type="button"
                class="btn btn-sm btn-ghost btn-circle"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div v-if="viewingUser" class="p-8 space-y-6">
            <div class="flex items-center gap-6">
              <div class="avatar placeholder">
                <div class="bg-gradient-to-br from-primary to-secondary text-primary-content rounded-full w-24">
                  <span class="text-3xl font-semibold">{{ viewingUser.name?.charAt(0).toUpperCase() }}</span>
                </div>
              </div>
              <div>
                <h4 class="text-2xl font-bold">{{ viewingUser.name }}</h4>
                <p class="text-base-content/60">{{ viewingUser.email }}</p>
                <div class="mt-2">
                  <div :class="getRoleBadgeClass(viewingUser.role)" class="badge badge-lg capitalize">
                    {{ viewingUser.role }}
                  </div>
                </div>
              </div>
            </div>

            <div class="divider"></div>

            <div class="grid grid-cols-2 gap-6">
              <div>
                <div class="text-sm text-base-content/60 mb-1">User ID</div>
                <div class="font-mono font-semibold">#{{ viewingUser.id }}</div>
              </div>
              <div>
                <div class="text-sm text-base-content/60 mb-1">Role</div>
                <div class="font-semibold capitalize">{{ viewingUser.role }}</div>
              </div>
              <div>
                <div class="text-sm text-base-content/60 mb-1">Joined Date</div>
                <div class="font-semibold">{{ formatDate(viewingUser.createdAt) }}</div>
              </div>
              <div>
                <div class="text-sm text-base-content/60 mb-1">Last Updated</div>
                <div class="font-semibold">{{ formatDate(viewingUser.updatedAt) }}</div>
              </div>
            </div>

            <div class="divider"></div>

            <div class="flex gap-3">
              <button
                v-if="user?.role === 'admin'"
                @click="editUser(viewingUser); showViewModal = false"
                class="btn btn-primary flex-1"
              >
                Edit User
              </button>
              <button
                @click="showViewModal = false"
                class="btn btn-ghost flex-1"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

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
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeModal"></div>

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
            class="relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden bg-base-100 border border-base-300/30"
          >
            <!-- Header -->
            <div class="relative bg-gradient-to-br from-primary to-secondary p-8 text-primary-content">
              <div class="flex items-start gap-4">
                <div class="shrink-0 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div class="flex-1">
                  <h3 class="text-2xl font-bold mb-1">{{ showEditModal ? 'Edit User' : 'Create New User' }}</h3>
                  <p class="text-sm opacity-90">{{ showEditModal ? 'Update user information' : 'Add a new user to the system' }}</p>
                </div>
                <button
                  @click="closeModal"
                  type="button"
                  class="btn btn-sm btn-ghost btn-circle"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Form -->
            <form @submit.prevent="showEditModal ? handleUpdate() : handleCreate()" class="p-8 space-y-6">
              <div class="space-y-2">
                <label class="block">
                  <span class="text-sm font-semibold flex items-center gap-2">
                    Full Name
                    <span class="text-error text-xs">*</span>
                  </span>
                </label>
                <input
                  v-model="formData.name"
                  type="text"
                  required
                  placeholder="Enter full name"
                  class="input input-bordered w-full"
                />
              </div>

              <div class="space-y-2">
                <label class="block">
                  <span class="text-sm font-semibold flex items-center gap-2">
                    Email Address
                    <span class="text-error text-xs">*</span>
                  </span>
                </label>
                <input
                  v-model="formData.email"
                  type="email"
                  required
                  placeholder="user@example.com"
                  class="input input-bordered w-full"
                />
              </div>

              <div class="space-y-2">
                <label class="block">
                  <span class="text-sm font-semibold flex items-center gap-2">
                    Password
                    <span v-if="!showEditModal" class="text-error text-xs">*</span>
                    <span v-else class="text-xs text-base-content/60 font-normal">(Optional)</span>
                  </span>
                </label>
                <input
                  v-model="formData.password"
                  type="password"
                  :required="!showEditModal"
                  minlength="6"
                  :placeholder="showEditModal ? 'Leave blank to keep current' : 'Minimum 6 characters'"
                  class="input input-bordered w-full"
                />
              </div>

              <div class="space-y-2">
                <label class="block">
                  <span class="text-sm font-semibold flex items-center gap-2">
                    Role
                    <span class="text-error text-xs">*</span>
                  </span>
                </label>
                <select
                  v-model="formData.role"
                  class="select select-bordered w-full"
                  required
                >
                  <option disabled value="">Select a role</option>
                  <option value="user">User - Standard access</option>
                  <option value="moderator">Moderator - Can view users</option>
                  <option value="admin">Admin - Full access</option>
                </select>
              </div>

              <div class="flex gap-3 pt-4">
                <button
                  type="button"
                  @click="closeModal"
                  class="btn btn-ghost flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="modalLoading"
                  class="btn btn-primary flex-1 gap-2"
                >
                  <span v-if="modalLoading" class="loading loading-spinner loading-sm"></span>
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

// State
const users = ref<any[]>([]);
const loading = ref(false);
const modalLoading = ref(false);
const error = ref('');
const success = ref('');
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showViewModal = ref(false);
const viewingUser = ref<any>(null);
const editingUserId = ref<number | null>(null);
const selectedUsers = ref<number[]>([]);

// Search and Filter
const searchQuery = ref('');
const roleFilter = ref('');
const sortBy = ref('newest');
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Form
const formData = reactive({
  name: '',
  email: '',
  password: '',
  role: 'user',
});

// Computed
const canManageUsers = computed(() => {
  return user.value?.role === 'admin' || user.value?.role === 'moderator';
});

const filteredUsers = computed(() => {
  let filtered = [...users.value];

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(u =>
      u.name?.toLowerCase().includes(query) ||
      u.email?.toLowerCase().includes(query)
    );
  }

  // Role filter
  if (roleFilter.value) {
    filtered = filtered.filter(u => u.role === roleFilter.value);
  }

  // Sort
  switch (sortBy.value) {
    case 'newest':
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'oldest':
      filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      break;
    case 'name':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      filtered.sort((a, b) => b.name.localeCompare(a.name));
      break;
  }

  return filtered;
});

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage.value));

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredUsers.value.slice(start, end);
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

// Methods
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

const clearFilters = () => {
  searchQuery.value = '';
  roleFilter.value = '';
  currentPage.value = 1;
};

const toggleSelect = (id: number) => {
  const index = selectedUsers.value.indexOf(id);
  if (index > -1) {
    selectedUsers.value.splice(index, 1);
  } else {
    selectedUsers.value.push(id);
  }
};

const toggleSelectAll = () => {
  if (selectedUsers.value.length === paginatedUsers.value.length) {
    selectedUsers.value = [];
  } else {
    selectedUsers.value = paginatedUsers.value.map(u => u.id);
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

const viewUser = (u: any) => {
  viewingUser.value = u;
  showViewModal.value = true;
};

const openCreateModal = () => {
  formData.name = '';
  formData.email = '';
  formData.password = '';
  formData.role = 'user';
  showCreateModal.value = true;
};

const editUser = (u: any) => {
  editingUserId.value = u.id;
  formData.name = u.name;
  formData.email = u.email;
  formData.password = '';
  formData.role = u.role;
  showEditModal.value = true;
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
    selectedUsers.value = selectedUsers.value.filter(uid => uid !== id);
    await fetchUsers();

    setTimeout(() => {
      success.value = '';
    }, 3000);
  } catch (err: any) {
    error.value = err.message || 'Failed to delete user';
  }
};

const bulkDelete = async () => {
  if (!confirm(`Are you sure you want to delete ${selectedUsers.value.length} users?`)) return;

  error.value = '';

  try {
    await Promise.all(
      selectedUsers.value.map(id =>
        fetchWithAuth(`http://localhost:3001/api/users/${id}`, {
          method: 'DELETE',
        })
      )
    );

    success.value = `${selectedUsers.value.length} users deleted successfully`;
    selectedUsers.value = [];
    await fetchUsers();

    setTimeout(() => {
      success.value = '';
    }, 3000);
  } catch (err: any) {
    error.value = err.message || 'Failed to delete users';
  }
};

// Watch filters to reset pagination
watch([searchQuery, roleFilter, sortBy], () => {
  currentPage.value = 1;
});

// Redirect if not authenticated
watchEffect(() => {
  if (!isAuthenticated.value) {
    router.push('/login');
  }
});

// Initialize
onMounted(async () => {
  initAuth();
  await nextTick();

  if (isAuthenticated.value && canManageUsers.value) {
    await fetchUsers();
  }
});
</script>
