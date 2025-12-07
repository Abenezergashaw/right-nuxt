<script setup lang="ts">
const items = [
  "https://fs.betunit.com/17634790516501001-multibet-bonus.jpg",
  "https://fs.betunit.com/1763477638856Free%20bet%20banner.jpg",
  "https://fs.betunit.com/1763477602954Weekly%20giveaway%20banner.jpg",
  "https://fs.betunit.com/17634790735137-sport-cashback.jpg",
];
</script>

<template>
  <UCarousel
    v-slot="{ item }"
    loop
    :autoplay="{ delay: 8000 }"
    :items="items"
    class="border-b border-primary"
  >
    <img :src="item" height="200" class="rounded-none w-full px-0" />
  </UCarousel>
</template>
