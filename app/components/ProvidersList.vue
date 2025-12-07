<template>
  <div class="w-full flex justify-center mb-4">
    <select
      class="border rounded-xl px-3 py-2 text-sm bg-white text-accent border-accent w-[80%] mx-auto"
      v-model="internalValue"
      @change="onChange"
    >
      <option disabled value="">Select provider</option>
      <option v-for="item in items" :key="item.provider" :value="item">
        {{ item.provider }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["update:modelValue", "select"]);

const internalValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  (val) => {
    internalValue.value = val;
  }
);

function onChange() {
  emit("update:modelValue", internalValue.value);
  emit("select", internalValue.value);
}
</script>

<style scoped>
.text-accent {
  color: #486333;
}
.border-accent {
  border-color: #486333;
}
</style>
