<script setup>
import { ref, watch, onMounted } from "vue";

// Props
const props = defineProps({
  modelValue: {
    type: [String, Number, Object],
    default: null,
  },
  options: {
    type: Array,
    required: true,
  },
});

// Emits
const emit = defineEmits(["update:modelValue"]);

const internalValue = ref(props.modelValue);

// Set default value (first option) if no value is provided
onMounted(() => {
  if (!props.modelValue && props.options.length > 0) {
    internalValue.value = props.options[0];
    emit("update:modelValue", props.options[0]);
  }
});

// Watch for changes
watch(internalValue, (val) => {
  emit("update:modelValue", val);
});

watch(
  () => props.modelValue,
  (val) => {
    internalValue.value = val;
  }
);
</script>

<template>
  <div class="w-full">
    <select
      v-model="internalValue"
      class="w-full border border-gray-300 p-3 text-gray-800 bg-white"
    >
      <option v-for="(option, index) in options" :key="index" :value="option">
        {{ option }}
      </option>
    </select>
  </div>
</template>
