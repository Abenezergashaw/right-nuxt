<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["update:modelValue", "select"]);

function select(item) {
  emit("update:modelValue", item);
  emit("select", item);
}
</script>

<template>
  <div class="w-full overflow-x-auto whitespace-nowrap no-scrollbar p-2">
    <div class="inline-flex gap-2">
      <button
        v-for="item in items"
        :key="item"
        @click="select(item)"
        class="px-4 py-1 rounded-2xl text-xs font-medium border uppercase"
        :class="{
          'bg-accent text-white border-accent': item === modelValue,
          'bg-white text-accent border-accent': item !== modelValue,
        }"
      >
        {{ item }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.bg-accent {
  background-color: #486333;
}
.text-accent {
  color: #486333;
}
.border-accent {
  border-color: #486333;
}
</style>
