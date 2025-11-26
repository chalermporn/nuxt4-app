<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold">Profile</h1>
        <p class="text-base-content/60 mt-1">Manage your personal information and preferences</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <!-- Profile Content -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Profile Card -->
      <div class="card bg-base-100 shadow-xl lg:col-span-1 border border-primary/20">
        <div class="card-body items-center text-center">
          <div class="avatar placeholder mb-4 relative group">
            <div
              class="bg-primary text-primary-content rounded-full w-32 h-32 flex items-center justify-center ring-4 ring-primary/20 transition-all duration-300 group-hover:ring-8 group-hover:scale-105">
              <span class="text-5xl font-bold">{{ profileData?.name?.charAt(0).toUpperCase() }}</span>
            </div>
            <div
              class="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          <h2 class="card-title text-2xl">{{ profileData?.name }}</h2>
          <p class="text-base-content/60 text-sm">{{ profileData?.email }}</p>
          <div :class="roleBadgeClass" class="badge badge-lg mt-2 gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            {{ profileData?.role }}
          </div>

          <div class="divider"></div>

          <div class="stats stats-vertical shadow w-full bg-base-200/50">
            <div class="stat">
              <div class="stat-figure text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="stat-title">Member Since</div>
              <div class="stat-value text-lg text-primary">{{ formatDate(profileData?.createdAt) }}</div>
            </div>
            <div class="stat">
              <div class="stat-figure text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="stat-title">Last Updated</div>
              <div class="stat-value text-lg text-secondary">{{ formatDate(profileData?.updatedAt) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Profile Form -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Success Alert -->
        <div v-if="successMessage" class="alert alert-success shadow-lg animate-fade-in">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ successMessage }}</span>
          <button class="btn btn-sm btn-ghost" @click="successMessage = ''">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Error Alert -->
        <div v-if="errorMessage" class="alert alert-error shadow-lg animate-fade-in">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ errorMessage }}</span>
          <button class="btn btn-sm btn-ghost" @click="errorMessage = ''">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Personal Information -->
        <div
          class="card bg-base-100 shadow-xl border border-base-300 hover:border-primary/30 transition-all duration-300">
          <div class="card-body">
            <h3 class="card-title text-lg mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Personal Information
            </h3>

            <ProfileForm :initialData="profileData" @profile-updated="handleProfileUpdated" />
          </div>
        </div>

        <!-- Change Password -->
        <div
          class="card bg-base-100 shadow-xl border border-base-300 hover:border-primary/30 transition-all duration-300">
          <div class="card-body">
            <h3 class="card-title text-lg mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Change Password
            </h3>

            <form @submit.prevent="handleChangePassword" class="space-y-5">
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold">Current Password</span>
                  <span class="label-text-alt text-error">*</span>
                </label>
                <label class="input input-bordered flex items-center gap-2 focus-within:input-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input v-model="passwordForm.currentPassword" type="password" class="grow"
                    placeholder="Enter current password" required minlength="6" />
                </label>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-semibold">New Password</span>
                    <span class="label-text-alt text-error">*</span>
                  </label>
                  <label class="input input-bordered flex items-center gap-2 focus-within:input-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    <input v-model="passwordForm.newPassword" type="password" class="grow"
                      placeholder="Enter new password" required minlength="6" />
                  </label>
                  <label class="label">
                    <span class="label-text-alt">Min. 6 characters</span>
                  </label>
                </div>

                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-semibold">Confirm Password</span>
                    <span class="label-text-alt text-error">*</span>
                  </label>
                  <label class="input input-bordered flex items-center gap-2 focus-within:input-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <input v-model="passwordForm.confirmPassword" type="password" class="grow"
                      placeholder="Confirm new password" required minlength="6" />
                  </label>
                </div>
              </div>

              <div v-if="passwordError" class="alert alert-error shadow-md animate-fade-in">
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ passwordError }}</span>
              </div>

              <div class="card-actions justify-end gap-2 pt-4">
                <button type="button" class="btn btn-ghost btn-sm md:btn-md" @click="resetPasswordForm"
                  :disabled="isChangingPassword">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
                <button type="submit" class="btn btn-primary btn-sm md:btn-md" :disabled="isChangingPassword">
                  <span v-if="isChangingPassword" class="loading loading-spinner loading-sm"></span>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Account Preferences -->
        <div
          class="card bg-base-100 shadow-xl border border-base-300 hover:border-primary/30 transition-all duration-300">
          <div class="card-body">
            <h3 class="card-title text-lg mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Preferences
            </h3>

            <div class="space-y-5">
              <div class="form-control bg-base-200 p-4 rounded-lg">
                <label class="label cursor-pointer">
                  <div class="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <span class="label-text font-semibold">Email Notifications</span>
                      <p class="text-xs text-base-content/60">Receive updates via email</p>
                    </div>
                  </div>
                  <input v-model="preferences.emailNotifications" type="checkbox" class="toggle toggle-primary" />
                </label>
              </div>

              <div class="form-control bg-base-200 p-4 rounded-lg">
                <label class="label cursor-pointer">
                  <div class="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <div>
                      <span class="label-text font-semibold">Push Notifications</span>
                      <p class="text-xs text-base-content/60">Get instant push notifications</p>
                    </div>
                  </div>
                  <input v-model="preferences.pushNotifications" type="checkbox" class="toggle toggle-primary" />
                </label>
              </div>

              <div class="form-control bg-base-200 p-4 rounded-lg">
                <label class="label cursor-pointer">
                  <div class="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <span class="label-text font-semibold">Weekly Reports</span>
                      <p class="text-xs text-base-content/60">Receive weekly activity reports</p>
                    </div>
                  </div>
                  <input v-model="preferences.weeklyReports" type="checkbox" class="toggle toggle-primary" />
                </label>
              </div>

              <div class="divider"></div>

              <div class="card-actions justify-end">
                <button class="btn btn-primary btn-sm md:btn-md" @click="handleUpdatePreferences">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
});

const { user, updateUserData } = useAuth();

// State
const loading = ref(true);
const profileData = ref<any>(null);
const isUpdating = ref(false);
const isChangingPassword = ref(false);
const passwordError = ref('');
const successMessage = ref('');
const errorMessage = ref('');

// Profile form state
const profileForm = ref({
  name: '',
  email: '',
  phone: '',
  bio: ''
});

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const preferences = ref({
  emailNotifications: true,
  pushNotifications: false,
  weeklyReports: true
});

const roleBadgeClass = computed(() => {
  const role = profileData.value?.role;
  if (role === 'admin') return 'badge-error';
  if (role === 'moderator') return 'badge-warning';
  return 'badge-info';
});

// API URL
const API_URL = 'http://localhost:3001/api';
import ProfileForm from '@/components/ProfileForm.vue';

// Fetch profile data
const fetchProfile = async () => {
  loading.value = true;
  try {
    let token = localStorage.getItem('accessToken');
    if (!token) {
      console.warn('No access token found. Using mock profile data for development.');
      // Mock data for development environment
      profileData.value = {
        name: 'Demo User',
        email: 'demo@example.com',
        phone: '',
        bio: '',
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      // Initialize form with mock data
      profileForm.value = {
        name: profileData.value.name,
        email: profileData.value.email,
        phone: profileData.value.phone,
        bio: profileData.value.bio
      };
      loading.value = false;
      return;
    }

    const response = await fetch(`${API_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to fetch profile');

    const data = await response.json();
    profileData.value = data.user;

    // Initialize form with fetched data
    profileForm.value = {
      name: data.user.name || '',
      email: data.user.email || '',
      phone: data.user.phone || '',
      bio: data.user.bio || ''
    };
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    errorMessage.value = 'Failed to load profile data';
  } finally {
    loading.value = false;
  }
};

const formatDate = (date: Date | string | undefined) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const handleUpdateProfile = async () => {
  isUpdating.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('No access token');

    const response = await fetch(`${API_URL}/users/me`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileForm.value)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update profile');
    }

    // Update local profile data
    profileData.value = data.user;

    // Update user data in auth composable
    updateUserData(data.user);

    successMessage.value = 'Profile updated successfully!';

    // Auto-hide success message after 5 seconds
    setTimeout(() => {
      successMessage.value = '';
    }, 5000);
  } catch (error: any) {
    console.error('Failed to update profile:', error);
    errorMessage.value = error.message || 'Failed to update profile. Please try again.';
  } finally {
    isUpdating.value = false;
  }
};

const handleChangePassword = async () => {
  passwordError.value = '';
  errorMessage.value = '';
  successMessage.value = '';

  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = 'New passwords do not match';
    return;
  }

  if (passwordForm.value.newPassword.length < 6) {
    passwordError.value = 'Password must be at least 6 characters';
    return;
  }

  isChangingPassword.value = true;

  try {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('No access token');

    const response = await fetch(`${API_URL}/users/me/change-password`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        currentPassword: passwordForm.value.currentPassword,
        newPassword: passwordForm.value.newPassword
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to change password');
    }

    successMessage.value = 'Password changed successfully!';
    resetPasswordForm();

    // Auto-hide success message after 5 seconds
    setTimeout(() => {
      successMessage.value = '';
    }, 5000);
  } catch (error: any) {
    console.error('Failed to change password:', error);
    passwordError.value = error.message || 'Failed to change password. Please try again.';
  } finally {
    isChangingPassword.value = false;
  }
};

const handleUpdatePreferences = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  try {
    // Simulate API call (implement actual API endpoint later)
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('Updating preferences:', preferences.value);

    successMessage.value = 'Preferences saved successfully!';

    // Auto-hide success message after 5 seconds
    setTimeout(() => {
      successMessage.value = '';
    }, 5000);
  } catch (error) {
    console.error('Failed to update preferences:', error);
    errorMessage.value = 'Failed to save preferences. Please try again.';
  }
};

// New method to handle profile update event from ProfileForm component
const handleProfileUpdated = (updatedUser: any) => {
  profileData.value = updatedUser;
  updateUserData(updatedUser);
  successMessage.value = 'Profile updated successfully!';
  setTimeout(() => {
    successMessage.value = '';
  }, 5000);
};

const resetProfileForm = () => {
  if (profileData.value) {
    profileForm.value = {
      name: profileData.value.name || '',
      email: profileData.value.email || '',
      phone: profileData.value.phone || '',
      bio: profileData.value.bio || ''
    };
  }
};

const resetPasswordForm = () => {
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  passwordError.value = '';
};

// Fetch profile on mount
onMounted(() => {
  fetchProfile();
});
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>
