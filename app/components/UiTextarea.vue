<template>
    <div class="form-control w-full">
        <label v-if="label" :for="id" class="label pb-1.5">
            <span class="label-text font-semibold text-base text-base-content/80">
                {{ label }}
                <span v-if="required" class="text-error">*</span>
            </span>
        </label>
        <div class="relative group">
            <!-- Textarea -->
            <textarea :id="id" v-bind="$attrs" :value="modelValue"
                @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
                :placeholder="placeholder" :required="required" :rows="rows" :class="[
                    'textarea textarea-bordered w-full transition-all duration-300 bg-base-100 text-base',
                    'focus:textarea-primary focus:ring-4 focus:ring-primary/10 focus:border-primary',
                    'hover:border-base-content/30',
                    error ? 'textarea-error focus:ring-error/10 focus:border-error' : ''
                ]"></textarea>
        </div>

        <!-- Error Message -->
        <label v-if="error" class="label pt-1">
            <span class="label-text-alt text-error flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd" />
                </svg>
                {{ error }}
            </span>
        </label>

        <!-- Helper Text -->
        <label v-else-if="helperText" class="label pt-1">
            <span class="label-text-alt text-base-content/60">{{ helperText }}</span>
        </label>
    </div>
</template>

<script setup lang="ts">
defineOptions({
    inheritAttrs: false
});

const props = defineProps({
    label: {
        type: String,
        default: ''
    },
    modelValue: {
        type: [String, Number, null],
        default: ''
    },
    placeholder: {
        type: String,
        default: ''
    },
    required: {
        type: Boolean,
        default: false
    },
    error: {
        type: String,
        default: ''
    },
    helperText: {
        type: String,
        default: ''
    },
    rows: {
        type: [String, Number],
        default: 3
    },
    id: {
        type: String,
        default: () => `textarea-${Math.random().toString(36).substr(2, 9)}`
    }
});

defineEmits(['update:modelValue']);
</script>
