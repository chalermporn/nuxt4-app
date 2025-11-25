<template>
  <div>
    <!-- Alerts -->
    <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0" leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
      <div v-if="error" role="alert" class="alert alert-error mb-6 shadow-lg border-l-4 border-error">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"
          stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="font-medium">{{ error }}</span>
      </div>
    </Transition>

    <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0" leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
      <div v-if="success" role="alert" class="alert alert-success mb-6 shadow-lg border-l-4 border-success">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"
          stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="font-medium">{{ success }}</span>
      </div>
    </Transition>

    <!-- Header Section -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold mb-3 bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
        Roles & Permissions
      </h1>
      <p class="text-base-content/60">Manage roles and their associated permissions</p>
    </div>

    <!-- Admin Only Content -->
    <div v-if="isAdmin">
      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Total Roles Card -->
        <div
          class="relative bg-linear-to-br from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/20 overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div
            class="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500">
          </div>
          <div class="relative flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-base-content/60 mb-2">Total Roles</p>
              <h3 class="text-4xl font-bold text-primary mb-1">{{ roles.length }}</h3>
              <p class="text-xs text-base-content/50">Defined system roles</p>
            </div>
            <div class="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 stroke-primary"
                stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Total Permissions Card -->
        <div
          class="relative bg-linear-to-br from-secondary/10 to-secondary/5 rounded-2xl p-6 border border-secondary/20 overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div
            class="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500">
          </div>
          <div class="relative flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-base-content/60 mb-2">Permissions</p>
              <h3 class="text-4xl font-bold text-secondary mb-1">{{ permissions.length }}</h3>
              <p class="text-xs text-base-content/50">Available permissions</p>
            </div>
            <div class="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 stroke-secondary"
                stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Resources Card -->
        <div
          class="relative bg-linear-to-br from-accent/10 to-accent/5 rounded-2xl p-6 border border-accent/20 overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div
            class="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500">
          </div>
          <div class="relative flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-base-content/60 mb-2">Resources</p>
              <h3 class="text-4xl font-bold text-accent mb-1">{{ uniqueResources.length }}</h3>
              <p class="text-xs text-base-content/50">Protected resources</p>
            </div>
            <div class="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 stroke-accent"
                stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div role="tablist" class="tabs tabs-boxed bg-base-200 p-1 mb-6">
        <a role="tab" :class="['tab', { 'tab-active': activeTab === 'roles' }]" @click="activeTab = 'roles'">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Roles
        </a>
        <a role="tab" :class="['tab', { 'tab-active': activeTab === 'permissions' }]"
          @click="activeTab = 'permissions'">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          Permissions
        </a>
      </div>

      <!-- Roles Tab Content -->
      <div v-show="activeTab === 'roles'"
        class="bg-base-100 rounded-2xl shadow-xl border border-base-300/50 overflow-hidden">
        <div class="p-8">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 class="text-2xl font-bold mb-1">System Roles</h2>
              <p class="text-sm text-base-content/60">Define and manage user roles</p>
            </div>
            <button @click="showCreateRoleModal = true"
              class="btn btn-primary gap-2 shadow-lg hover:shadow-xl transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Role
            </button>
          </div>

          <!-- Roles Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="role in roles" :key="role.id"
              class="card bg-base-200 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300">
              <div class="card-body">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <h3 class="card-title text-lg capitalize">{{ role.name }}</h3>
                    <p class="text-sm text-base-content/60 mt-1">{{ role.description || 'No description' }}</p>
                  </div>
                  <div class="dropdown dropdown-end">
                    <label tabindex="0" class="btn btn-ghost btn-sm btn-circle">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </label>
                    <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                      <li>
                        <a @click="editRole(role)">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </a>
                      </li>
                      <li>
                        <a @click="manageRolePermissions(role)" class="text-primary">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                          </svg>
                          Manage Permissions
                        </a>
                      </li>
                      <li>
                        <a @click="deleteRole(role.id)" class="text-error">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="divider my-2"></div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-base-content/60">Permissions</span>
                  <div class="badge badge-primary badge-sm">{{ getRolePermissionCount(role.id) }}</div>
                </div>
                <div class="text-xs text-base-content/50 mt-2">
                  Created {{ formatDate(role.createdAt) }}
                </div>
              </div>
            </div>
          </div>

          <div v-if="roles.length === 0" class="text-center py-16">
            <div class="w-20 h-20 mx-auto mb-6 bg-base-200 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-base-content/30" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <p class="text-xl font-bold text-base-content mb-2">No roles defined</p>
            <p class="text-sm text-base-content/60">Create your first role to get started</p>
          </div>
        </div>
      </div>

      <!-- Permissions Tab Content -->
      <div v-show="activeTab === 'permissions'"
        class="bg-base-100 rounded-2xl shadow-xl border border-base-300/50 overflow-hidden">
        <div class="p-8">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 class="text-2xl font-bold mb-1">System Permissions</h2>
              <p class="text-sm text-base-content/60">Manage available permissions</p>
            </div>
            <button @click="showCreatePermissionModal = true"
              class="btn btn-primary gap-2 shadow-lg hover:shadow-xl transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Permission
            </button>
          </div>

          <!-- Permissions Table -->
          <div class="overflow-x-auto -mx-8">
            <table class="table">
              <thead>
                <tr class="border-b border-base-300">
                  <th class="bg-base-200/50 font-semibold">Name</th>
                  <th class="bg-base-200/50 font-semibold">Resource</th>
                  <th class="bg-base-200/50 font-semibold">Action</th>
                  <th class="bg-base-200/50 font-semibold">Description</th>
                  <th class="bg-base-200/50 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="permission in permissions" :key="permission.id"
                  class="hover:bg-base-200/30 transition-colors border-b border-base-200/50">
                  <td class="font-semibold">{{ permission.name }}</td>
                  <td>
                    <div class="badge badge-outline capitalize">{{ permission.resource }}</div>
                  </td>
                  <td>
                    <div class="badge badge-ghost capitalize">{{ permission.action }}</div>
                  </td>
                  <td class="text-sm text-base-content/70">{{ permission.description || 'No description' }}</td>
                  <td class="text-right">
                    <div class="inline-flex gap-2">
                      <button @click="editPermission(permission)" class="btn btn-sm btn-ghost hover:btn-primary group"
                        title="Edit permission">
                        <svg xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24"
                          stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button @click="deletePermission(permission.id)"
                        class="btn btn-sm btn-ghost hover:btn-error group" title="Delete permission">
                        <svg xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24"
                          stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="permissions.length === 0" class="text-center py-16">
            <div class="w-20 h-20 mx-auto mb-6 bg-base-200 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-base-content/30" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <p class="text-xl font-bold text-base-content mb-2">No permissions defined</p>
            <p class="text-sm text-base-content/60">Create your first permission to get started</p>
          </div>
        </div>
      </div>
    </div>

    <!-- No Permission Message -->
    <div v-else class="bg-base-100 rounded-2xl shadow-xl border border-base-300/50 overflow-hidden">
      <div class="text-center py-20 px-8">
        <div
          class="w-24 h-24 mx-auto mb-6 bg-linear-to-br from-error/20 to-warning/20 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-error" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold mb-3">Access Restricted</h1>
        <p class="text-base-content/60 mb-8 max-w-md mx-auto">Only administrators can manage roles and permissions.</p>
        <button @click="router.push('/dashboard')"
          class="btn btn-primary gap-2 h-12 px-6 shadow-lg hover:shadow-xl transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Go Back
        </button>
      </div>
    </div>

    <!-- Create Role Modal -->
    <Teleport to="body">
      <dialog :open="showCreateRoleModal" class="modal modal-open" v-if="showCreateRoleModal">
        <div class="modal-box max-w-md">
          <h3 class="font-bold text-lg mb-4">Create New Role</h3>
          <form @submit.prevent="handleCreateRole">
            <div class="mb-4">
              <UiInput v-model="newRole.name" label="Role Name" placeholder="e.g., editor" required />
            </div>
            <div class="mb-6">
              <UiTextarea v-model="newRole.description" label="Description" placeholder="Describe the role's purpose"
                :rows="3" />
            </div>
            <div class="modal-action">
              <button type="button" @click="showCreateRoleModal = false; resetNewRole()" class="btn btn-ghost">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" :disabled="loading">
                <span v-if="loading" class="loading loading-spinner loading-sm"></span>
                Create Role
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button @click="showCreateRoleModal = false; resetNewRole()">close</button>
        </form>
      </dialog>
    </Teleport>

    <!-- Edit Role Modal -->
    <Teleport to="body">
      <dialog :open="showEditRoleModal" class="modal modal-open" v-if="showEditRoleModal">
        <div class="modal-box max-w-md">
          <h3 class="font-bold text-lg mb-4">Edit Role</h3>
          <form @submit.prevent="handleUpdateRole">
            <div class="mb-4">
              <UiInput v-model="editingRole.name" label="Role Name" placeholder="e.g., editor" required />
            </div>
            <div class="mb-6">
              <UiTextarea v-model="editingRole.description" label="Description"
                placeholder="Describe the role's purpose" :rows="3" />
            </div>
            <div class="modal-action">
              <button type="button" @click="showEditRoleModal = false; resetEditingRole()" class="btn btn-ghost">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" :disabled="loading">
                <span v-if="loading" class="loading loading-spinner loading-sm"></span>
                Update Role
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button @click="showEditRoleModal = false; resetEditingRole()">close</button>
        </form>
      </dialog>
    </Teleport>

    <!-- Create Permission Modal -->
    <Teleport to="body">
      <dialog :open="showCreatePermissionModal" class="modal modal-open" v-if="showCreatePermissionModal">
        <div class="modal-box max-w-md">
          <h3 class="font-bold text-lg mb-4">Create New Permission</h3>
          <form @submit.prevent="handleCreatePermission">
            <div class="mb-4">
              <UiInput v-model="newPermission.resource" label="Resource" placeholder="e.g., posts" required />
            </div>
            <div class="mb-4">
              <UiInput v-model="newPermission.action" label="Action" placeholder="e.g., create" required />
            </div>
            <div class="mb-4">
              <UiInput
                :model-value="newPermission.resource && newPermission.action ? `${newPermission.resource}:${newPermission.action}` : ''"
                label="Name (auto-generated)" disabled />
            </div>
            <div class="mb-6">
              <UiTextarea v-model="newPermission.description" label="Description"
                placeholder="Describe what this permission allows" :rows="3" />
            </div>
            <div class="modal-action">
              <button type="button" @click="showCreatePermissionModal = false; resetNewPermission()"
                class="btn btn-ghost">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary"
                :disabled="loading || !newPermission.resource || !newPermission.action">
                <span v-if="loading" class="loading loading-spinner loading-sm"></span>
                Create Permission
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button @click="showCreatePermissionModal = false; resetNewPermission()">close</button>
        </form>
      </dialog>
    </Teleport>

    <!-- Edit Permission Modal -->
    <Teleport to="body">
      <dialog :open="showEditPermissionModal" class="modal modal-open" v-if="showEditPermissionModal">
        <div class="modal-box max-w-md">
          <h3 class="font-bold text-lg mb-4">Edit Permission</h3>
          <form @submit.prevent="handleUpdatePermission">
            <div class="mb-4">
              <UiInput v-model="editingPermission.resource" label="Resource" placeholder="e.g., posts" required />
            </div>
            <div class="mb-4">
              <UiInput v-model="editingPermission.action" label="Action" placeholder="e.g., create" required />
            </div>
            <div class="mb-4">
              <UiInput v-model="editingPermission.name" label="Name" required />
            </div>
            <div class="mb-6">
              <UiTextarea v-model="editingPermission.description" label="Description"
                placeholder="Describe what this permission allows" :rows="3" />
            </div>
            <div class="modal-action">
              <button type="button" @click="showEditPermissionModal = false; resetEditingPermission()"
                class="btn btn-ghost">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" :disabled="loading">
                <span v-if="loading" class="loading loading-spinner loading-sm"></span>
                Update Permission
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button @click="showEditPermissionModal = false; resetEditingPermission()">close</button>
        </form>
      </dialog>
    </Teleport>

    <!-- Manage Role Permissions Modal -->
    <Teleport to="body">
      <dialog :open="showManagePermissionsModal" class="modal modal-open" v-if="showManagePermissionsModal">
        <div class="modal-box max-w-2xl">
          <h3 class="font-bold text-lg mb-4">Manage Permissions for {{ managingRole?.name }}</h3>
          <div class="mb-6">
            <p class="text-sm text-base-content/60 mb-4">Select permissions to assign to this role</p>
            <div class="max-h-96 overflow-y-auto">
              <div v-for="permission in permissions" :key="permission.id" class="form-control">
                <label class="label cursor-pointer justify-start gap-4">
                  <input type="checkbox" :checked="selectedPermissionIds.includes(permission.id)"
                    @change="togglePermission(permission.id)" class="checkbox checkbox-primary" />
                  <div class="flex-1">
                    <div class="font-semibold">{{ permission.name }}</div>
                    <div class="text-sm text-base-content/60">{{ permission.description || 'No description' }}</div>
                    <div class="flex gap-2 mt-1">
                      <div class="badge badge-outline badge-sm">{{ permission.resource }}</div>
                      <div class="badge badge-ghost badge-sm">{{ permission.action }}</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
          <div class="modal-action">
            <button type="button" @click="showManagePermissionsModal = false; resetManagingRole()"
              class="btn btn-ghost">
              Cancel
            </button>
            <button @click="handleUpdateRolePermissions" class="btn btn-primary" :disabled="loading">
              <span v-if="loading" class="loading loading-spinner loading-sm"></span>
              Save Permissions
            </button>
          </div>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button @click="showManagePermissionsModal = false; resetManagingRole()">close</button>
        </form>
      </dialog>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';

definePageMeta({
  layout: 'dashboard'
});

const API_BASE = 'http://localhost:3001/api';

const router = useRouter();
const { user, isAuthenticated, initAuth, fetchWithAuth } = useAuth();

const activeTab = ref('roles');
const error = ref('');
const success = ref('');
const showCreateRoleModal = ref(false);
const showEditRoleModal = ref(false);
const showCreatePermissionModal = ref(false);
const showEditPermissionModal = ref(false);
const showManagePermissionsModal = ref(false);
const loading = ref(false);

interface Role {
  id: number;
  name: string;
  description: string | null;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

interface Permission {
  id: number;
  name: string;
  resource: string;
  action: string;
  description: string | null;
  createdAt: Date | string;
}

interface RolePermission {
  roleId: number;
  permissionId: number;
}

const roles = ref<Role[]>([]);
const permissions = ref<Permission[]>([]);
const rolePermissions = ref<{ [roleId: number]: Permission[] }>({});

// Form data
const newRole = ref({ name: '', description: '' });
const editingRole = ref<Partial<Role> & { id?: number }>({ name: '', description: '' });
const newPermission = ref({ resource: '', action: '', description: '' });
const editingPermission = ref<Partial<Permission> & { id?: number }>({ name: '', resource: '', action: '', description: '' });
const managingRole = ref<Role | null>(null);
const selectedPermissionIds = ref<number[]>([]);

const isAdmin = computed(() => {
  return user.value?.role === 'admin';
});

const uniqueResources = computed(() => {
  return [...new Set(permissions.value.map(p => p.resource))];
});

const getRolePermissionCount = (roleId: number) => {
  return rolePermissions.value[roleId]?.length || 0;
};

const formatDate = (date: any) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Fetch roles from API
const fetchRoles = async () => {
  try {
    loading.value = true;
    const response = await fetchWithAuth<{ roles: Role[] }>(`${API_BASE}/rbac/roles`);
    roles.value = response.roles;

    // Fetch permissions for each role
    for (const role of roles.value) {
      await fetchRolePermissions(role.id);
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to fetch roles';
    setTimeout(() => error.value = '', 5000);
  } finally {
    loading.value = false;
  }
};

// Fetch permissions from API
const fetchPermissions = async () => {
  try {
    loading.value = true;
    const response = await fetchWithAuth<{ permissions: Permission[] }>(`${API_BASE}/rbac/permissions`);
    permissions.value = response.permissions;
  } catch (err: any) {
    error.value = err.message || 'Failed to fetch permissions';
    setTimeout(() => error.value = '', 5000);
  } finally {
    loading.value = false;
  }
};

// Fetch permissions for a specific role
const fetchRolePermissions = async (roleId: number) => {
  try {
    const response = await fetchWithAuth<{ permissions: Permission[] }>(`${API_BASE}/rbac/roles/${roleId}/permissions`);
    rolePermissions.value[roleId] = response.permissions;
  } catch (err: any) {
    console.error(`Failed to fetch permissions for role ${roleId}:`, err);
  }
};

// Reset functions
const resetNewRole = () => {
  newRole.value = { name: '', description: '' };
};

const resetEditingRole = () => {
  editingRole.value = { name: '', description: '' };
};

const resetNewPermission = () => {
  newPermission.value = { resource: '', action: '', description: '' };
};

const resetEditingPermission = () => {
  editingPermission.value = { name: '', resource: '', action: '', description: '' };
};

const resetManagingRole = () => {
  managingRole.value = null;
  selectedPermissionIds.value = [];
};

// Role CRUD operations
const handleCreateRole = async () => {
  try {
    loading.value = true;
    await fetchWithAuth(`${API_BASE}/rbac/roles`, {
      method: 'POST',
      body: newRole.value,
    });
    success.value = 'Role created successfully';
    setTimeout(() => success.value = '', 5000);
    showCreateRoleModal.value = false;
    resetNewRole();
    await fetchRoles();
  } catch (err: any) {
    error.value = err.data?.error || 'Failed to create role';
    setTimeout(() => error.value = '', 5000);
  } finally {
    loading.value = false;
  }
};

const editRole = (role: Role) => {
  editingRole.value = { ...role };
  showEditRoleModal.value = true;
};

const handleUpdateRole = async () => {
  if (!editingRole.value.id) return;

  try {
    loading.value = true;
    await fetchWithAuth(`${API_BASE}/rbac/roles/${editingRole.value.id}`, {
      method: 'PATCH',
      body: {
        name: editingRole.value.name,
        description: editingRole.value.description,
      },
    });
    success.value = 'Role updated successfully';
    setTimeout(() => success.value = '', 5000);
    showEditRoleModal.value = false;
    resetEditingRole();
    await fetchRoles();
  } catch (err: any) {
    error.value = err.data?.error || 'Failed to update role';
    setTimeout(() => error.value = '', 5000);
  } finally {
    loading.value = false;
  }
};

const deleteRole = async (roleId: number) => {
  if (!confirm('Are you sure you want to delete this role?')) return;

  try {
    await fetchWithAuth(`${API_BASE}/rbac/roles/${roleId}`, {
      method: 'DELETE',
    });
    success.value = 'Role deleted successfully';
    setTimeout(() => success.value = '', 5000);
    await fetchRoles();
  } catch (err: any) {
    error.value = err.data?.error || 'Failed to delete role';
    setTimeout(() => error.value = '', 5000);
  }
};

// Permission CRUD operations
const handleCreatePermission = async () => {
  try {
    loading.value = true;
    const name = `${newPermission.value.resource}:${newPermission.value.action}`;
    await fetchWithAuth(`${API_BASE}/rbac/permissions`, {
      method: 'POST',
      body: {
        name,
        resource: newPermission.value.resource,
        action: newPermission.value.action,
        description: newPermission.value.description,
      },
    });
    success.value = 'Permission created successfully';
    setTimeout(() => success.value = '', 5000);
    showCreatePermissionModal.value = false;
    resetNewPermission();
    await fetchPermissions();
  } catch (err: any) {
    error.value = err.data?.error || 'Failed to create permission';
    setTimeout(() => error.value = '', 5000);
  } finally {
    loading.value = false;
  }
};

const editPermission = (permission: Permission) => {
  editingPermission.value = { ...permission };
  showEditPermissionModal.value = true;
};

const handleUpdatePermission = async () => {
  if (!editingPermission.value.id) return;

  try {
    loading.value = true;
    await fetchWithAuth(`${API_BASE}/rbac/permissions/${editingPermission.value.id}`, {
      method: 'PATCH',
      body: {
        name: editingPermission.value.name,
        resource: editingPermission.value.resource,
        action: editingPermission.value.action,
        description: editingPermission.value.description,
      },
    });
    success.value = 'Permission updated successfully';
    setTimeout(() => success.value = '', 5000);
    showEditPermissionModal.value = false;
    resetEditingPermission();
    await fetchPermissions();
  } catch (err: any) {
    error.value = err.data?.error || 'Failed to update permission';
    setTimeout(() => error.value = '', 5000);
  } finally {
    loading.value = false;
  }
};

// Role permissions management
const manageRolePermissions = async (role: Role) => {
  managingRole.value = role;
  // Get current permissions for this role
  const currentPerms = rolePermissions.value[role.id] || [];
  selectedPermissionIds.value = currentPerms.map(p => p.id);
  showManagePermissionsModal.value = true;
};

const togglePermission = (permissionId: number) => {
  const index = selectedPermissionIds.value.indexOf(permissionId);
  if (index > -1) {
    selectedPermissionIds.value.splice(index, 1);
  } else {
    selectedPermissionIds.value.push(permissionId);
  }
};

const handleUpdateRolePermissions = async () => {
  if (!managingRole.value) return;

  try {
    loading.value = true;
    await fetchWithAuth(`${API_BASE}/rbac/roles/${managingRole.value.id}/permissions`, {
      method: 'PUT',
      body: {
        permissionIds: selectedPermissionIds.value,
      },
    });
    success.value = 'Role permissions updated successfully';
    setTimeout(() => success.value = '', 5000);
    showManagePermissionsModal.value = false;
    await fetchRolePermissions(managingRole.value.id);
    resetManagingRole();
  } catch (err: any) {
    error.value = err.data?.error || 'Failed to update role permissions';
    setTimeout(() => error.value = '', 5000);
  } finally {
    loading.value = false;
  }
};

const deletePermission = async (permissionId: number) => {
  if (!confirm('Are you sure you want to delete this permission?')) return;

  try {
    await fetchWithAuth(`${API_BASE}/rbac/permissions/${permissionId}`, {
      method: 'DELETE',
    });
    success.value = 'Permission deleted successfully';
    setTimeout(() => success.value = '', 5000);
    await fetchPermissions();
  } catch (err: any) {
    error.value = err.data?.error || 'Failed to delete permission';
    setTimeout(() => error.value = '', 5000);
  }
};

// Redirect if not authenticated
watchEffect(() => {
  if (!isAuthenticated.value) {
    router.push('/login');
  }
});

// Initialize auth and fetch data on mount
onMounted(async () => {
  initAuth();
  if (isAuthenticated.value && isAdmin.value) {
    await Promise.all([fetchRoles(), fetchPermissions()]);
  }
});
</script>
