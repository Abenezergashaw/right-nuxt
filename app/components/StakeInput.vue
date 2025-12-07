<script setup>
import { ref } from "vue";

const general = useGeneral();
const stake = computed({
  get: () => general.stake,
  set: (value) => general.setStake(value),
});
const increment = () => {
  general.increment();
};

const decrement = () => {
  if (stake.value > 10) general.decrement();
};
</script>

<template>
  <div class="flex items-center">
    <button @click="decrement" class="bg-default h-8 text-white px-2 rounded-l">
      <Icon name="heroicons-minus" class="w-4 h-4" />
    </button>

    <input
      v-model="stake"
      type="number"
      class="w-40 h-8 text-center text-xs bg-white rounded-none focus:outline-none focus:ring-2 focus:ring-[var(--ui-bg)]"
    />

    <button @click="increment" class="bg-default h-8 text-white px-2 rounded-r">
      <Icon name="heroicons-plus" class="w-4 h-4" />
    </button>
  </div>
</template>

<style scoped>
/* Optional: prevent number input arrows */
input::-webkit-inner-spin-button,
input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
