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
        <div class="relative bg-linear-to-br from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/20 overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div class="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
          <div class="relative flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-base-content/60 mb-2">Total Roles</p>
              <h3 class="text-4xl font-bold text-primary mb-1">{{ roles.length }}</h3>
              <p class="text-xs text-base-content/50">Defined system roles</p>
            </div>
            <div class="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 stroke-primary" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Total Permissions Card -->
        <div class="relative bg-linear-to-br from-secondary/10 to-secondary/5 rounded-2xl p-6 border border-secondary/20 overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div class="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
          <div class="relative flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-base-content/60 mb-2">Permissions</p>
              <h3 class="text-4xl font-bold text-secondary mb-1">{{ permissions.length }}</h3>
              <p class="text-xs text-base-content/50">Available permissions</p>
            </div>
            <div class="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 stroke-secondary" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Resources Card -->
        <div class="relative bg-linear-to-br from-accent/10 to-accent/5 rounded-2xl p-6 border border-accent/20 overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div class="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
          <div class="relative flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-base-content/60 mb-2">Resources</p>
              <h3 class="text-4xl font-bold text-accent mb-1">{{ uniqueResources.length }}</h3>
              <p class="text-xs text-base-content/50">Protected resources</p>
            </div>
            <div class="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 stroke-accent" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div role="tablist" class="tabs tabs-boxed bg-base-200 p-1 mb-6">
        <a
          role="tab"
          :class="['tab', { 'tab-active': activeTab === 'roles' }]"
          @click="activeTab = 'roles'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Roles
        </a>
        <a
          role="tab"
          :class="['tab', { 'tab-active': activeTab === 'permissions' }]"
          @click="activeTab = 'permissions'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          Permissions
        </a>
      </div>

      <!-- Roles Tab Content -->
      <div v-show="activeTab === 'roles'" class="bg-base-100 rounded-2xl shadow-xl border border-base-300/50 overflow-hidden">
        <div class="p-8">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 class="text-2xl font-bold mb-1">System Roles</h2>
              <p class="text-sm text-base-content/60">Define and manage user roles</p>
            </div>
            <button
              @click="showCreateRoleModal = true"
              class="btn btn-primary gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Role
            </button>
          </div>

          <!-- Roles Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="role in roles"
              :key="role.id"
              class="card bg-base-200 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300"
            >
              <div class="card-body">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <h3 class="card-title text-lg capitalize">{{ role.name }}</h3>
                    <p class="text-sm text-base-content/60 mt-1">{{ role.description || 'No description' }}</p>
                  </div>
                  <div class="dropdown dropdown-end">
                    <label tabindex="0" class="btn btn-ghost btn-sm btn-circle">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </label>
                    <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                      <li>
                        <a @click="editRole(role)">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </a>
                      </li>
                      <li>
                        <a @click="manageRolePermissions(role)" class="text-primary">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                          </svg>
                          Manage Permissions
                        </a>
                      </li>
                      <li>
                        <a @click="deleteRole(role.id)" class="text-error">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <p class="text-xl font-bold text-base-content mb-2">No roles defined</p>
            <p class="text-sm text-base-content/60">Create your first role to get started</p>
          </div>
        </div>
      </div>

      <!-- Permissions Tab Content -->
      <div v-show="activeTab === 'permissions'" class="bg-base-100 rounded-2xl shadow-xl border border-base-300/50 overflow-hidden">
        <div class="p-8">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 class="text-2xl font-bold mb-1">System Permissions</h2>
              <p class="text-sm text-base-content/60">Manage available permissions</p>
            </div>
            <button
              @click="showCreatePermissionModal = true"
              class="btn btn-primary gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
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
                <tr v-for="permission in permissions" :key="permission.id" class="hover:bg-base-200/30 transition-colors border-b border-base-200/50">
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
                      <button
                        @click="editPermission(permission)"
                        class="btn btn-sm btn-ghost hover:btn-primary group"
                        title="Edit permission"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        @click="deletePermission(permission.id)"
                        class="btn btn-sm btn-ghost hover:btn-error group"
                        title="Delete permission"
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

          <div v-if="permissions.length === 0" class="text-center py-16">
            <div class="w-20 h-20 mx-auto mb-6 bg-base-200 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
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
        <div class="w-24 h-24 mx-auto mb-6 bg-linear-to-br from-error/20 to-warning/20 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold mb-3">Access Restricted</h1>
        <p class="text-base-content/60 mb-8 max-w-md mx-auto">Only administrators can manage roles and permissions.</p>
        <button @click="router.push('/dashboard')" class="btn btn-primary gap-2 h-12 px-6 shadow-lg hover:shadow-xl transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Go Back
        </button>
      </div>
    </div>

    <!-- Placeholder modals - These would contain forms for creating/editing roles and permissions -->
    <!-- For brevity, I'm showing simplified modals. In production, these would have full forms -->
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';

definePageMeta({
  layout: 'dashboard'
});

const router = useRouter();
const { user, isAuthenticated, initAuth } = useAuth();

const activeTab = ref('roles');
const error = ref('');
const success = ref('');
const showCreateRoleModal = ref(false);
const showCreatePermissionModal = ref(false);

// Mock data - In production, this would come from an API
const roles = ref([
  { id: 1, name: 'admin', description: 'Full system access with all permissions', createdAt: new Date() },
  { id: 2, name: 'moderator', description: 'Can view and manage users', createdAt: new Date() },
  { id: 3, name: 'user', description: 'Standard user access', createdAt: new Date() },
]);

const permissions = ref([
  { id: 1, name: 'users:create', resource: 'users', action: 'create', description: 'Create new users' },
  { id: 2, name: 'users:read', resource: 'users', action: 'read', description: 'View user information' },
  { id: 3, name: 'users:update', resource: 'users', action: 'update', description: 'Update user information' },
  { id: 4, name: 'users:delete', resource: 'users', action: 'delete', description: 'Delete users' },
  { id: 5, name: 'roles:create', resource: 'roles', action: 'create', description: 'Create new roles' },
  { id: 6, name: 'roles:read', resource: 'roles', action: 'read', description: 'View roles' },
  { id: 7, name: 'roles:update', resource: 'roles', action: 'update', description: 'Update roles' },
  { id: 8, name: 'roles:delete', resource: 'roles', action: 'delete', description: 'Delete roles' },
]);

const rolePermissions = ref([
  { roleId: 1, permissionId: 1 },
  { roleId: 1, permissionId: 2 },
  { roleId: 1, permissionId: 3 },
  { roleId: 1, permissionId: 4 },
  { roleId: 1, permissionId: 5 },
  { roleId: 1, permissionId: 6 },
  { roleId: 1, permissionId: 7 },
  { roleId: 1, permissionId: 8 },
  { roleId: 2, permissionId: 2 },
  { roleId: 2, permissionId: 3 },
]);

const isAdmin = computed(() => {
  return user.value?.role === 'admin';
});

const uniqueResources = computed(() => {
  return [...new Set(permissions.value.map(p => p.resource))];
});

const getRolePermissionCount = (roleId: number) => {
  return rolePermissions.value.filter(rp => rp.roleId === roleId).length;
};

const formatDate = (date: any) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const editRole = (role: any) => {
  // TODO: Implement edit role functionality
  console.log('Edit role:', role);
};

const deleteRole = (roleId: number) => {
  if (!confirm('Are you sure you want to delete this role?')) return;
  // TODO: Implement delete role functionality
  console.log('Delete role:', roleId);
};

const manageRolePermissions = (role: any) => {
  // TODO: Implement manage role permissions functionality
  console.log('Manage permissions for role:', role);
};

const editPermission = (permission: any) => {
  // TODO: Implement edit permission functionality
  console.log('Edit permission:', permission);
};

const deletePermission = (permissionId: number) => {
  if (!confirm('Are you sure you want to delete this permission?')) return;
  // TODO: Implement delete permission functionality
  console.log('Delete permission:', permissionId);
};

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
