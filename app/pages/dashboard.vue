<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navigation Bar -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-900">Dashboard</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-700">
              Welcome, <strong>{{ user?.name }}</strong> 
              <span class="ml-2 px-2 py-1 text-xs rounded-full" :class="roleClass">
                {{ user?.role }}
              </span>
            </span>
            <button
              @click="handleLogout"
              class="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ error }}
      </div>

      <div v-if="success" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
        {{ success }}
      </div>

      <!-- User Management Section (Admin/Moderator only) -->
      <div v-if="canManageUsers" class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">User Management</h2>
          <button
            v-if="user?.role === 'admin'"
            @click="showCreateModal = true"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Add User
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-2 text-gray-600">Loading users...</p>
        </div>

        <!-- Users Table -->
        <div v-else-if="users.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th v-if="user?.role === 'admin'" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="u in users" :key="u.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ u.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ u.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ u.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs rounded-full" :class="getRoleClass(u.role)">
                    {{ u.role }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(u.createdAt) }}
                </td>
                <td v-if="user?.role === 'admin'" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click="editUser(u)"
                    class="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    @click="deleteUser(u.id)"
                    :disabled="u.id === user?.id"
                    class="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="text-center py-8 text-gray-500">
          No users found
        </div>
      </div>

      <!-- No Permission Message -->
      <div v-else class="bg-white rounded-lg shadow p-6 text-center">
        <p class="text-gray-600">You don't have permission to manage users.</p>
        <p class="text-sm text-gray-500 mt-2">Contact your administrator for access.</p>
      </div>
    </div>

    <!-- Create/Edit User Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-md w-full">
        <h3 class="text-xl font-bold mb-4">{{ showEditModal ? 'Edit User' : 'Create New User' }}</h3>
        
        <form @submit.prevent="showEditModal ? handleUpdate() : handleCreate()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="formData.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password {{ showEditModal ? '(leave blank to keep current)' : '' }}</label>
            <input
              v-model="formData.password"
              type="password"
              :required="!showEditModal"
              minlength="6"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              v-model="formData.role"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div class="flex space-x-3 mt-6">
            <button
              type="submit"
              :disabled="modalLoading"
              class="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {{ modalLoading ? 'Processing...' : (showEditModal ? 'Update' : 'Create') }}
            </button>
            <button
              type="button"
              @click="closeModal"
              class="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
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

const roleClass = computed(() => {
  const role = user.value?.role;
  if (role === 'admin') return 'bg-red-100 text-red-800';
  if (role === 'moderator') return 'bg-yellow-100 text-yellow-800';
  return 'bg-blue-100 text-blue-800';
});

const getRoleClass = (role: string) => {
  if (role === 'admin') return 'bg-red-100 text-red-800';
  if (role === 'moderator') return 'bg-yellow-100 text-yellow-800';
  return 'bg-blue-100 text-blue-800';
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
