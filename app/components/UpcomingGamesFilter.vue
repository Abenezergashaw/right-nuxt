<script setup>
import { t } from "@/composables/locales";

defineProps({
  title: String,
  current: String,
});
</script>

<template>
  <div
    @click="$emit('filterGamesByDate', title)"
    class="text-[11px] font-semibold py-1 rounded-sm px-5"
    :style="{
      backgroundColor: title !== current ? 'white' : '#42BC86',
      color: title !== current ? 'black' : 'black',
    }"
  >
    {{ t(title) }}
  </div>
</template>
