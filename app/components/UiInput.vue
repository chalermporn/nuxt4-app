<template>
    <div class="form-control w-full">
        <label v-if="label" :for="id" class="label pb-1.5">
            <span class="label-text font-semibold text-base text-base-content/80">
                {{ label }}
                <span v-if="required" class="text-error">*</span>
            </span>
        </label>
        <div class="relative group">
            <!-- Icon -->
            <div v-if="icon"
                class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/40 group-focus-within:text-primary transition-colors duration-300">
                <slot name="icon">
                    <!-- Default icon slot or render icon prop if it was a component (but slot is more flexible) -->
                </slot>
            </div>

            <!-- Input -->
            <input :id="id" v-bind="$attrs" :value="modelValue"
                @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" :type="type"
                :placeholder="placeholder" :required="required" :class="[
                    'input input-bordered w-full h-12 transition-all duration-300 bg-base-100',
                    'focus:input-primary focus:ring-4 focus:ring-primary/10 focus:border-primary',
                    'hover:border-base-content/30',
                    icon ? 'pl-12' : 'pl-4',
                    error ? 'input-error focus:ring-error/10 focus:border-error' : ''
                ]" />
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
    type: {
        type: String,
        default: 'text'
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
    icon: {
        type: Boolean,
        default: false
    },
    id: {
        type: String,
        default: () => `input-${Math.random().toString(36).substr(2, 9)}`
    }
});

defineEmits(['update:modelValue']);
</script>
