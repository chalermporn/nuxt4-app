<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold">Profile</h1>
        <p class="text-base-content/60 mt-1">Manage your personal information and preferences</p>
      </div>
    </div>

    <!-- Profile Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Profile Card -->
      <div class="card bg-base-100 shadow-xl lg:col-span-1">
        <div class="card-body items-center text-center">
          <div class="avatar placeholder mb-4">
            <div class="bg-primary text-primary-content rounded-full w-32">
              <span class="text-5xl font-bold">{{ user?.name?.charAt(0).toUpperCase() }}</span>
            </div>
          </div>
          <h2 class="card-title text-2xl">{{ user?.name }}</h2>
          <p class="text-base-content/60">{{ user?.email }}</p>
          <div :class="roleBadgeClass" class="badge badge-lg mt-2">{{ user?.role }}</div>
          
          <div class="divider"></div>
          
          <div class="stats stats-vertical shadow w-full">
            <div class="stat">
              <div class="stat-title">Member Since</div>
              <div class="stat-value text-lg">{{ formatDate(user?.createdAt) }}</div>
            </div>
            <div class="stat">
              <div class="stat-title">Last Login</div>
              <div class="stat-value text-lg">{{ formatDate(new Date()) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Profile Form -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Personal Information -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h3 class="card-title">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Personal Information
            </h3>
            
            <form @submit.prevent="handleUpdateProfile" class="space-y-4">
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Full Name</span>
                </label>
                <input 
                  v-model="profileForm.name" 
                  type="text" 
                  placeholder="Enter your full name" 
                  class="input input-bordered w-full" 
                  required 
                />
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">Email</span>
                </label>
                <input 
                  v-model="profileForm.email" 
                  type="email" 
                  placeholder="Enter your email" 
                  class="input input-bordered w-full" 
                  required 
                />
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">Phone Number</span>
                </label>
                <input 
                  v-model="profileForm.phone" 
                  type="tel" 
                  placeholder="Enter your phone number" 
                  class="input input-bordered w-full" 
                />
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">Bio</span>
                </label>
                <textarea 
                  v-model="profileForm.bio" 
                  placeholder="Tell us about yourself" 
                  class="textarea textarea-bordered h-24" 
                ></textarea>
              </div>

              <div class="card-actions justify-end">
                <button type="button" class="btn btn-ghost" @click="resetProfileForm">
                  Cancel
                </button>
                <button type="submit" class="btn btn-primary" :disabled="isUpdating">
                  <span v-if="isUpdating" class="loading loading-spinner"></span>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Change Password -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h3 class="card-title">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Change Password
            </h3>
            
            <form @submit.prevent="handleChangePassword" class="space-y-4">
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Current Password</span>
                </label>
                <input 
                  v-model="passwordForm.currentPassword" 
                  type="password" 
                  placeholder="Enter current password" 
                  class="input input-bordered w-full" 
                  required 
                />
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">New Password</span>
                </label>
                <input 
                  v-model="passwordForm.newPassword" 
                  type="password" 
                  placeholder="Enter new password" 
                  class="input input-bordered w-full" 
                  required 
                  minlength="6"
                />
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">Confirm New Password</span>
                </label>
                <input 
                  v-model="passwordForm.confirmPassword" 
                  type="password" 
                  placeholder="Confirm new password" 
                  class="input input-bordered w-full" 
                  required 
                  minlength="6"
                />
              </div>

              <div v-if="passwordError" class="alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ passwordError }}</span>
              </div>

              <div class="card-actions justify-end">
                <button type="button" class="btn btn-ghost" @click="resetPasswordForm">
                  Cancel
                </button>
                <button type="submit" class="btn btn-primary" :disabled="isChangingPassword">
                  <span v-if="isChangingPassword" class="loading loading-spinner"></span>
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Account Preferences -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h3 class="card-title">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Preferences
            </h3>
            
            <div class="space-y-4">
              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">Email Notifications</span>
                  <input v-model="preferences.emailNotifications" type="checkbox" class="toggle toggle-primary" />
                </label>
              </div>

              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">Push Notifications</span>
                  <input v-model="preferences.pushNotifications" type="checkbox" class="toggle toggle-primary" />
                </label>
              </div>

              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">Weekly Reports</span>
                  <input v-model="preferences.weeklyReports" type="checkbox" class="toggle toggle-primary" />
                </label>
              </div>

              <div class="divider"></div>

              <div class="card-actions justify-end">
                <button class="btn btn-primary" @click="handleUpdatePreferences">
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
  layout: 'dashboard',
});

const { user } = useAuth();

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

const isUpdating = ref(false);
const isChangingPassword = ref(false);
const passwordError = ref('');

const roleBadgeClass = computed(() => {
  const role = user.value?.role;
  if (role === 'admin') return 'badge-error';
  if (role === 'moderator') return 'badge-warning';
  return 'badge-info';
});

// Initialize form with user data
watchEffect(() => {
  if (user.value) {
    profileForm.value.name = user.value.name || '';
    profileForm.value.email = user.value.email || '';
    profileForm.value.phone = user.value.phone || '';
    profileForm.value.bio = user.value.bio || '';
  }
});

const formatDate = (date: Date | string | undefined) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const handleUpdateProfile = async () => {
  isUpdating.value = true;
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update user data (in real app, call API)
    console.log('Updating profile:', profileForm.value);
    
    // Show success message
    alert('Profile updated successfully!');
  } catch (error) {
    console.error('Failed to update profile:', error);
    alert('Failed to update profile. Please try again.');
  } finally {
    isUpdating.value = false;
  }
};

const handleChangePassword = async () => {
  passwordError.value = '';
  
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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Changing password');
    
    // Show success message and reset form
    alert('Password changed successfully!');
    resetPasswordForm();
  } catch (error) {
    console.error('Failed to change password:', error);
    passwordError.value = 'Failed to change password. Please try again.';
  } finally {
    isChangingPassword.value = false;
  }
};

const handleUpdatePreferences = async () => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('Updating preferences:', preferences.value);
    
    // Show success message
    alert('Preferences saved successfully!');
  } catch (error) {
    console.error('Failed to update preferences:', error);
    alert('Failed to save preferences. Please try again.');
  }
};

const resetProfileForm = () => {
  if (user.value) {
    profileForm.value.name = user.value.name || '';
    profileForm.value.email = user.value.email || '';
    profileForm.value.phone = user.value.phone || '';
    profileForm.value.bio = user.value.bio || '';
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
</script>
