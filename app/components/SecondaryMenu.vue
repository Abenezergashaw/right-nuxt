<script setup>
import { t } from "@/composables/locales";

defineProps({
  middleGameInfoState: String,
});
</script>
<template>
  <div class="h-12 flex bg-gray-200">
    <RouterLink
      to="/home/upcoming"
      @click="$emit('getUpcomingGames')"
      class="uppercase w-full h-full text-xs flex justify-center items-center flex-1 text-black border-r border-primary font-semibold"
      :class="`${middleGameInfoState === 'Upcoming' ? 'bg-white ' : ''}`"
    >
      {{ t("Upcoming") }}
    </RouterLink>
    <div
      v-if="false"
      class="uppercase w-full h-full text-xs flex justify-center items-center flex-1"
    >
      express
    </div>
    <RouterLink
      to="/home/top"
      class="uppercase w-full h-full text-xs flex justify-center items-center flex-1 text-black font-semibold"
      :class="`${middleGameInfoState === 'topSports' ? 'bg-white' : ''}`"
    >
      {{ t("Top Sports") }}
    </RouterLink>
  </div>
</template>
