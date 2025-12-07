<script setup>
defineProps({
  loader: Boolean,
});
</script>
<template>
  <Teleport to="body">
    <div
      v-if="loader"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div class="rounded-md px-6 py-4 flex flex-col items-center gap-3">
        <svg
          class="w-14 h-14 animate-spin text-primary"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l3 3-3 3v-4a8 8 0 01-8-8z"
          ></path>
        </svg>
      </div>
    </div>
  </Teleport>
</template>
