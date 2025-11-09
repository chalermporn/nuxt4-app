<template>
  <div></div>
</template>

<script setup lang="ts">
const router = useRouter();
const { isAuthenticated, initAuth } = useAuth();

onMounted(() => {
  initAuth();
  
  // Redirect based on authentication status
  if (isAuthenticated.value) {
    router.push('/dashboard');
  } else {
    router.push('/login');
  }
});
</script>
