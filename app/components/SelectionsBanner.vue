<script setup>
import { ref } from "vue";
import { t } from "@/composables/locales";

defineProps({
  selections: Array,
  activeSelection: {
    type: String,
    default: "Main",
  },
});

const emit = defineEmits();

// const activeSelection = ref("Main");

function selectItem(item) {
  emit("changeSelection", item);
}
</script>

<template>
  <div
    class="h-12 flex items-center gap-3 overflow-x-auto whitespace-nowrap px-2 no-scrollbar bg-default"
  >
    <div
      v-for="s in selections"
      :key="s"
      @click="selectItem(s)"
      class="relative cursor-pointer text-white uppercase text-xs tracking-wide px-2 py-1 transition-all shrink-0"
    >
      <span>{{ t(s) }}</span>
      <span
        class="absolute left-0 bottom-0 h-[3px] bg-primary transition-all duration-300"
        :class="activeSelection === s ? 'w-full' : 'w-0'"
      ></span>
    </div>
  </div>
</template>

<style scoped>
/* Hide scrollbar for Chrome, Safari, and Opera */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge, and Firefox */
.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
