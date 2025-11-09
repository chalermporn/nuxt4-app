<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8">
      <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">
        {{ isLoginMode ? 'Login' : 'Register' }}
      </h1>

      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ error }}
      </div>

      <div v-if="success" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
        {{ success }}
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div v-if="!isLoginMode">
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your name"
          />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            minlength="6"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Processing...' : (isLoginMode ? 'Login' : 'Register') }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <button
          @click="toggleMode"
          class="text-blue-600 hover:text-blue-800 text-sm"
        >
          {{ isLoginMode ? "Don't have an account? Register" : 'Already have an account? Login' }}
        </button>
      </div>

      <div v-if="isLoginMode" class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p class="text-sm text-yellow-800 font-medium mb-2">Demo Accounts:</p>
        <p class="text-xs text-yellow-700">Admin: admin@example.com / admin123</p>
        <p class="text-xs text-yellow-700">User: user@example.com / user123</p>
        <p class="text-xs text-yellow-600 mt-2">※ Run seed script first: bun run db:seed</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
