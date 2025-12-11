<script setup>
import { ref } from "vue";

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});

const openIndex = ref(null);

const toggle = (index) => {
  openIndex.value = openIndex.value === index ? null : index;
};
</script>

<template>
  <div class="space-y-3">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="border border-gray-300 rounded-md overflow-hidden text-black"
    >
      <!-- Header -->
      <button
        @click="toggle(index)"
        class="w-full flex items-center justify-between px-4 py-3 text-left"
        :class="
          !item.read && openIndex !== index
            ? ' animate-pulse bg-default text-white'
            : 'bg-white text-black'
        "
      >
        <div class="flex items-center gap-2">
          <UIcon :name="item.icon" class="text-gray-600" />
          <span class="font-medium">{{ item.label }}</span>
        </div>

        <UIcon
          name="i-heroicons-chevron-down"
          class="transition-transform duration-100"
          :class="openIndex === index ? 'rotate-180' : ''"
        />
      </button>

      <!-- Content with smooth animation -->
      <div
        class="transition-all duration-100 overflow-hidden"
        :style="{
          maxHeight: openIndex === index ? '1000px' : '0px',
        }"
      >
        <div class="px-4 py-3 text-sm text-gray-700 bg-white">
          {{ item.content }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Smooth animation trick (allows height animation) */
div[style] {
  will-change: max-height;
}
</style>
