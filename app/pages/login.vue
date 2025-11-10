<template>
  <div class="min-h-screen bg-base-200 grid lg:grid-cols-2">
    <!-- Left Side - Branding & Info -->
    <div class="hidden lg:flex flex-col justify-center items-start bg-base-100 p-16">
      <div class="max-w-lg">
        <!-- Logo -->
        <div class="mb-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>

        <!-- Title -->
        <h1 class="text-6xl font-bold mb-6 leading-tight">
          User Management<br>System
        </h1>
        <p class="text-lg text-base-content/70 mb-12 leading-relaxed">
          Secure authentication and role-based access control for your application.
        </p>

        <!-- Features -->
        <div class="space-y-6">
          <div class="flex items-start gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <h3 class="font-bold text-lg mb-1">Secure Authentication</h3>
              <p class="text-base-content/60">Industry-standard security with JWT tokens</p>
            </div>
          </div>
          <div class="flex items-start gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <h3 class="font-bold text-lg mb-1">Role Management</h3>
              <p class="text-base-content/60">Flexible role-based permissions system</p>
            </div>
          </div>
          <div class="flex items-start gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <h3 class="font-bold text-lg mb-1">Modern UI</h3>
              <p class="text-base-content/60">Built with Nuxt 4 and DaisyUI components</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Side - Login Form -->
    <div class="flex items-center justify-center p-8 lg:p-16">
      <div class="w-full max-w-lg">
        <!-- Mobile Logo -->
        <div class="lg:hidden text-center mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>

        <!-- Form Card -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body p-10">
            <!-- Header -->
            <div class="mb-8">
              <h2 class="text-4xl font-bold mb-2">
                {{ isLoginMode ? 'Welcome Back!' : 'Create Account' }}
              </h2>
              <p class="text-base-content/60">
                {{ isLoginMode ? 'Enter your credentials to continue' : 'Fill in your information to get started' }}
              </p>
            </div>

            <!-- Alerts -->
            <div v-if="error" role="alert" class="alert alert-error mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-sm">{{ error }}</span>
            </div>

            <div v-if="success" role="alert" class="alert alert-success mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-sm">{{ success }}</span>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Name Field (Register only) -->
              <div v-if="!isLoginMode" class="form-control">
                <label for="name" class="label pb-2">
                  <span class="label-text font-semibold text-base">Full Name<span class="text-error">*</span></span>
                </label>
                <label class="input input-bordered flex items-center gap-3 h-14 w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    required
                    placeholder="Enter your full name"
                    class="grow"
                  />
                </label>
              </div>

              <!-- Email Field -->
              <div class="form-control">
                <label for="email" class="label pb-2">
                  <span class="label-text font-semibold text-base">Email Address<span class="text-error">*</span></span>
                </label>
                <label class="input input-bordered flex items-center gap-3 h-14 w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    required
                    placeholder="your.email@example.com"
                    class="grow"
                  />
                </label>
              </div>

              <!-- Password Field -->
              <div class="form-control">
                <label for="password" class="label pb-2">
                  <span class="label-text font-semibold text-base">Password<span class="text-error">*</span></span>
                </label>
                <label class="input input-bordered flex items-center gap-3 h-14 w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input
                    id="password"
                    v-model="form.password"
                    type="password"
                    required
                    minlength="6"
                    placeholder="Enter your password"
                    class="grow"
                  />
                </label>
                <label class="label pt-2">
                  <span class="label-text-alt text-base-content/60">Minimum 6 characters</span>
                  <a v-if="isLoginMode" href="#" class="label-text-alt link link-hover link-primary">Forgot password?</a>
                </label>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="loading"
                class="btn btn-primary w-full h-14 text-base gap-2"
              >
                <span v-if="loading" class="loading loading-spinner"></span>
                <svg v-else-if="isLoginMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                {{ loading ? 'Processing...' : (isLoginMode ? 'Sign In to Dashboard' : 'Create Your Account') }}
              </button>
            </form>

            <!-- Divider -->
            <div class="divider my-6">or</div>

            <!-- Toggle Mode -->
            <div class="text-center">
              <span class="text-sm text-base-content/70">
                {{ isLoginMode ? "Don't have an account?" : 'Already have an account?' }}
              </span>
              <button @click="toggleMode" class="link link-primary font-semibold text-sm ml-1">
                {{ isLoginMode ? 'Sign up' : 'Sign in' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Demo Info -->
        <div v-if="isLoginMode" class="mt-6">
          <div class="collapse collapse-arrow bg-base-100 shadow">
            <input type="checkbox" />
            <div class="collapse-title font-medium flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Demo Credentials
            </div>
            <div class="collapse-content">
              <div class="space-y-3">
                <div class="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                  <div>
                    <div class="badge badge-error badge-sm mb-1">Admin</div>
                    <div class="text-sm">admin@example.com</div>
                  </div>
                  <kbd class="kbd kbd-sm">admin123</kbd>
                </div>
                <div class="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                  <div>
                    <div class="badge badge-info badge-sm mb-1">User</div>
                    <div class="text-sm">user@example.com</div>
                  </div>
                  <kbd class="kbd kbd-sm">user123</kbd>
                </div>
                <div class="alert alert-warning">
                  <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span class="text-xs">Run <kbd class="kbd kbd-xs">bun run db:seed</kbd> first</span>
                </div>
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
  layout: 'login'
});

const router = useRouter();
const { login, register, isAuthenticated } = useAuth();

const isLoginMode = ref(true);
const loading = ref(false);
const error = ref('');
const success = ref('');

const form = reactive({
  email: '',
  password: '',
  name: '',
});

// Redirect if already authenticated
watchEffect(() => {
  if (isAuthenticated.value) {
    router.push('/dashboard');
  }
});

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value;
  error.value = '';
  success.value = '';
};

const handleSubmit = async () => {
  loading.value = true;
  error.value = '';
  success.value = '';

  try {
    if (isLoginMode.value) {
      await login(form.email, form.password);
      success.value = 'Login successful! Redirecting...';
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } else {
      await register(form.email, form.password, form.name);
      success.value = 'Registration successful! Redirecting...';
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    }
  } catch (err: any) {
    error.value = err.message || 'An error occurred';
  } finally {
    loading.value = false;
  }
};

// Initialize auth on mount
onMounted(() => {
  const { initAuth } = useAuth();
  initAuth();
});
</script>
