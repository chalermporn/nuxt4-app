<template>
    <form @submit.prevent="handleUpdateProfile" class="space-y-5">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UiInput v-model="profileForm.name" label="Full Name" required />

            <UiInput v-model="profileForm.email" label="Email" type="email" required />
        </div>

        <UiInput v-model="profileForm.phone" label="Phone Number" type="tel" />

        <UiTextarea v-model="profileForm.bio" label="Bio" :maxlength="500" />

        <div class="card-actions justify-end gap-2 pt-4">
            <button type="button" class="btn btn-ghost btn-sm md:btn-md" @click="resetProfileForm"
                :disabled="isUpdating">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
            </button>
            <button type="submit" class="btn btn-primary btn-sm md:btn-md" :disabled="isUpdating">
                <span v-if="isUpdating" class="loading loading-spinner loading-sm"></span>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
            </button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useAuth } from '@/composables/useAuth';
import UiInput from '@/components/UiInput.vue';
import UiTextarea from '@/components/UiTextarea.vue';

// Props
const props = defineProps<{ initialData: any }>();
const emit = defineEmits<{ (e: 'profile-updated', updatedUser: any): void }>();

const { updateUserData } = useAuth();

// Local state
const isUpdating = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const profileForm = ref({
    name: '',
    email: '',
    phone: '',
    bio: ''
});

// Initialize form when prop changes
watch(
    () => props.initialData,
    (newVal) => {
        if (newVal) {
            profileForm.value = {
                name: newVal.name || '',
                email: newVal.email || '',
                phone: newVal.phone || '',
                bio: newVal.bio || ''
            };
        }
    },
    { immediate: true }
);

const API_URL = 'http://localhost:3001/api';

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
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(profileForm.value)
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Failed to update profile');
        }
        // Emit updated user to parent
        emit('profile-updated', data.user);
        successMessage.value = 'Profile updated successfully!';
        setTimeout(() => (successMessage.value = ''), 5000);
    } catch (error: any) {
        console.error('Failed to update profile:', error);
        errorMessage.value = error.message || 'Failed to update profile. Please try again.';
    } finally {
        isUpdating.value = false;
    }
};

const resetProfileForm = () => {
    if (props.initialData) {
        profileForm.value = {
            name: props.initialData.name || '',
            email: props.initialData.email || '',
            phone: props.initialData.phone || '',
            bio: props.initialData.bio || ''
        };
    }
};
</script>

<style scoped>
/* Reuse any needed styles from parent if required */
</style>
