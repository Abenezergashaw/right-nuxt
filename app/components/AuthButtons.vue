<script setup>
import { t } from "@/composables/locales";

defineProps({
  title: String,
  to: String,
});
</script>

<template>
  <UButton
    class="py-2.5 px-5 font-semibold text-xs rounded-sm uppercase"
    :color="title === 'Login' ? 'success' : 'warning'"
    :variant="title === 'Login' ? 'outline' : 'solid'"
    :to="to"
  >
    {{ t(title) }}
  </UButton>
</template>
