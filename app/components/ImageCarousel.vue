<script setup lang="ts">
const items = ["/promo/1.jpg", "/promo/2.jpg", "/promo/3.jpg"];
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
