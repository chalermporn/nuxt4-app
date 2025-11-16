<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold">Settings</h1>
        <p class="text-base-content/60 mt-1">Manage your application settings and preferences</p>
      </div>
    </div>

    <!-- Settings Content -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Settings Navigation -->
      <div class="lg:col-span-1">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body p-2">
            <ul class="menu">
              <li>
                <a 
                  :class="{ 'active': activeTab === 'general' }"
                  @click="activeTab = 'general'"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  General
                </a>
              </li>
              <li>
                <a 
                  :class="{ 'active': activeTab === 'appearance' }"
                  @click="activeTab = 'appearance'"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  Appearance
                </a>
              </li>
              <li>
                <a 
                  :class="{ 'active': activeTab === 'notifications' }"
                  @click="activeTab = 'notifications'"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  Notifications
                </a>
              </li>
              <li>
                <a 
                  :class="{ 'active': activeTab === 'security' }"
                  @click="activeTab = 'security'"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Security
                </a>
              </li>
              <li>
                <a 
                  :class="{ 'active': activeTab === 'privacy' }"
                  @click="activeTab = 'privacy'"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Privacy
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Settings Content -->
      <div class="lg:col-span-3 space-y-6">
        <!-- General Settings -->
        <div v-if="activeTab === 'general'" class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">General Settings</h2>
            
            <form @submit.prevent="handleSaveGeneral" class="space-y-4">
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Language</span>
                </label>
                <select v-model="generalSettings.language" class="select select-bordered w-full">
                  <option value="en">English</option>
                  <option value="th">ภาษาไทย</option>
                  <option value="ja">日本語</option>
                  <option value="zh">中文</option>
                </select>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">Timezone</span>
                </label>
                <select v-model="generalSettings.timezone" class="select select-bordered w-full">
                  <option value="UTC">UTC</option>
                  <option value="Asia/Bangkok">Bangkok (UTC+7)</option>
                  <option value="Asia/Tokyo">Tokyo (UTC+9)</option>
                  <option value="America/New_York">New York (UTC-5)</option>
                </select>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">Date Format</span>
                </label>
                <select v-model="generalSettings.dateFormat" class="select select-bordered w-full">
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div class="card-actions justify-end mt-6">
                <button type="submit" class="btn btn-primary">
                  Save General Settings
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Appearance Settings -->
        <div v-if="activeTab === 'appearance'" class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">Appearance Settings</h2>
            
            <div class="space-y-4">
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Theme</span>
                </label>
                <select v-model="appearanceSettings.theme" class="select select-bordered w-full">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="cupcake">Cupcake</option>
                  <option value="cyberpunk">Cyberpunk</option>
                  <option value="forest">Forest</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>

              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">Auto Dark Mode</span>
                  <input v-model="appearanceSettings.autoDarkMode" type="checkbox" class="toggle toggle-primary" />
                </label>
                <label class="label">
                  <span class="label-text-alt">Automatically switch to dark mode at night</span>
                </label>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">Sidebar Position</span>
                </label>
                <div class="flex gap-2">
                  <button 
                    type="button"
                    :class="['btn flex-1', appearanceSettings.sidebarPosition === 'left' ? 'btn-primary' : 'btn-outline']"
                    @click="appearanceSettings.sidebarPosition = 'left'"
                  >
                    Left
                  </button>
                  <button 
                    type="button"
                    :class="['btn flex-1', appearanceSettings.sidebarPosition === 'right' ? 'btn-primary' : 'btn-outline']"
                    @click="appearanceSettings.sidebarPosition = 'right'"
                  >
                    Right
                  </button>
                </div>
              </div>

              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">Compact Mode</span>
                  <input v-model="appearanceSettings.compactMode" type="checkbox" class="toggle toggle-primary" />
                </label>
                <label class="label">
                  <span class="label-text-alt">Reduce spacing and padding throughout the app</span>
                </label>
              </div>

              <div class="card-actions justify-end mt-6">
                <button class="btn btn-primary" @click="handleSaveAppearance">
                  Save Appearance Settings
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Notifications Settings -->
        <div v-if="activeTab === 'notifications'" class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">Notification Settings</h2>
            
            <div class="space-y-4">
              <div class="alert alert-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Configure how you receive notifications</span>
              </div>

              <div class="divider">Email Notifications</div>

              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">Account Activity</span>
                  <input v-model="notificationSettings.emailAccountActivity" type="checkbox" class="toggle toggle-primary" />
                </label>
              </div>

              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">Security Alerts</span>
                  <input v-model="notificationSettings.emailSecurityAlerts" type="checkbox" class="toggle toggle-primary" />
                </label>
              </div>

              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">Weekly Reports</span>
                  <input v-model="notificationSettings.emailWeeklyReports" type="checkbox" class="toggle toggle-primary" />
                </label>
              </div>

              <div class="divider">Push Notifications</div>

              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">Real-time Updates</span>
                  <input v-model="notificationSettings.pushRealtime" type="checkbox" class="toggle toggle-primary" />
                </label>
              </div>

              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">Mentions & Comments</span>
                  <input v-model="notificationSettings.pushMentions" type="checkbox" class="toggle toggle-primary" />
                </label>
              </div>

              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">System Alerts</span>
                  <input v-model="notificationSettings.pushSystemAlerts" type="checkbox" class="toggle toggle-primary" />
                </label>
              </div>

              <div class="card-actions justify-end mt-6">
                <button class="btn btn-primary" @click="handleSaveNotifications">
                  Save Notification Settings
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Security Settings -->
        <div v-if="activeTab === 'security'" class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">Security Settings</h2>
            
            <div class="space-y-4">
              <div class="alert alert-warning">
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Protect your account with strong security settings</span>
              </div>

              <div class="form-control">
                <label class="label cursor-pointer">
                  <div>
                    <span class="label-text">Two-Factor Authentication (2FA)</span>
                    <p class="text-xs text-base-content/60 mt-1">Add an extra layer of security to your account</p>
                  </div>
                  <input v-model="securitySettings.twoFactorEnabled" type="checkbox" class="toggle toggle-primary" />
                </label>
              </div>

              <div class="form-control">
                <label class="label cursor-pointer">
                  <div>
                    <span class="label-text">Login Alerts</span>
                    <p class="text-xs text-base-content/60 mt-1">Get notified of new login attempts</p>
                  </div>
                  <input v-model="securitySettings.loginAlerts" type="checkbox" class="toggle toggle-primary" />
                </label>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">Session Timeout</span>
                </label>
                <select v-model="securitySettings.sessionTimeout" class="select select-bordered w-full">
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="240">4 hours</option>
                  <option value="1440">24 hours</option>
                </select>
              </div>

              <div class="divider">Active Sessions</div>

              <div class="overflow-x-auto">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Device</th>
                      <th>Location</th>
                      <th>Last Active</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div class="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <div class="font-bold">Chrome on Mac</div>
                            <div class="text-sm opacity-50">Current Session</div>
                          </div>
                        </div>
                      </td>
                      <td>Bangkok, Thailand</td>
                      <td>Just now</td>
                      <td>
                        <span class="badge badge-success">Active</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="card-actions justify-end mt-6">
                <button class="btn btn-error btn-outline" @click="handleRevokeAllSessions">
                  Revoke All Sessions
                </button>
                <button class="btn btn-primary" @click="handleSaveSecurity">
                  Save Security Settings
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Privacy Settings -->
        <div v-if="activeTab === 'privacy'" class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">Privacy Settings</h2>
            
            <div class="space-y-4">
              <div class="form-control">
                <label class="label cursor-pointer">
                  <div>
                    <span class="label-text">Profile Visibility</span>
                    <p class="text-xs text-base-content/60 mt-1">Make your profile visible to other users</p>
                  </div>
                  <input v-model="privacySettings.profileVisible" type="checkbox" class="toggle toggle-primary" />
                </label>
              </div>

              <div class="form-control">
                <label class="label cursor-pointer">
                  <div>
                    <span class="label-text">Show Online Status</span>
                    <p class="text-xs text-base-content/60 mt-1">Let others see when you're online</p>
                  </div>
                  <input v-model="privacySettings.showOnlineStatus" type="checkbox" class="toggle toggle-primary" />
                </label>
              </div>

              <div class="form-control">
                <label class="label cursor-pointer">
                  <div>
                    <span class="label-text">Activity Tracking</span>
                    <p class="text-xs text-base-content/60 mt-1">Allow tracking of your activity for analytics</p>
                  </div>
                  <input v-model="privacySettings.activityTracking" type="checkbox" class="toggle toggle-primary" />
                </label>
              </div>

              <div class="form-control">
                <label class="label cursor-pointer">
                  <div>
                    <span class="label-text">Data Sharing</span>
                    <p class="text-xs text-base-content/60 mt-1">Share anonymized data for improvement</p>
                  </div>
                  <input v-model="privacySettings.dataSharing" type="checkbox" class="toggle toggle-primary" />
                </label>
              </div>

              <div class="divider">Data Management</div>

              <div class="flex gap-2">
                <button class="btn btn-outline flex-1" @click="handleDownloadData">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download My Data
                </button>
                <button class="btn btn-error btn-outline flex-1" @click="handleDeleteAccount">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Account
                </button>
              </div>

              <div class="card-actions justify-end mt-6">
                <button class="btn btn-primary" @click="handleSavePrivacy">
                  Save Privacy Settings
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

const activeTab = ref('general');

const generalSettings = ref({
  language: 'en',
  timezone: 'Asia/Bangkok',
  dateFormat: 'DD/MM/YYYY'
});

const appearanceSettings = ref({
  theme: 'light',
  autoDarkMode: false,
  sidebarPosition: 'left',
  compactMode: false
});

const notificationSettings = ref({
  emailAccountActivity: true,
  emailSecurityAlerts: true,
  emailWeeklyReports: false,
  pushRealtime: true,
  pushMentions: true,
  pushSystemAlerts: true
});

const securitySettings = ref({
  twoFactorEnabled: false,
  loginAlerts: true,
  sessionTimeout: '60'
});

const privacySettings = ref({
  profileVisible: true,
  showOnlineStatus: true,
  activityTracking: true,
  dataSharing: false
});

const handleSaveGeneral = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Saving general settings:', generalSettings.value);
    alert('General settings saved successfully!');
  } catch (error) {
    console.error('Failed to save general settings:', error);
    alert('Failed to save settings. Please try again.');
  }
};

const handleSaveAppearance = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Saving appearance settings:', appearanceSettings.value);
    alert('Appearance settings saved successfully!');
  } catch (error) {
    console.error('Failed to save appearance settings:', error);
    alert('Failed to save settings. Please try again.');
  }
};

const handleSaveNotifications = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Saving notification settings:', notificationSettings.value);
    alert('Notification settings saved successfully!');
  } catch (error) {
    console.error('Failed to save notification settings:', error);
    alert('Failed to save settings. Please try again.');
  }
};

const handleSaveSecurity = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Saving security settings:', securitySettings.value);
    alert('Security settings saved successfully!');
  } catch (error) {
    console.error('Failed to save security settings:', error);
    alert('Failed to save settings. Please try again.');
  }
};

const handleSavePrivacy = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Saving privacy settings:', privacySettings.value);
    alert('Privacy settings saved successfully!');
  } catch (error) {
    console.error('Failed to save privacy settings:', error);
    alert('Failed to save settings. Please try again.');
  }
};

const handleRevokeAllSessions = () => {
  if (confirm('Are you sure you want to revoke all sessions? You will be logged out.')) {
    console.log('Revoking all sessions');
    alert('All sessions revoked successfully!');
  }
};

const handleDownloadData = () => {
  console.log('Downloading user data');
  alert('Your data download has been initiated. You will receive an email shortly.');
};

const handleDeleteAccount = () => {
  if (confirm('Are you sure you want to delete your account? This action cannot be undone!')) {
    console.log('Deleting account');
    alert('Account deletion has been scheduled. You will receive a confirmation email.');
  }
};
</script>

<style scoped>
.menu li > a.active {
  background-color: hsl(var(--p));
  color: hsl(var(--pc));
}
</style>
