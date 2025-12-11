<script setup>
definePageMeta({
  layout: "secondary",
});

const messages = ref([
  {
    label: "04/12/2025",
    content:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam, libero voluptates? Molestias rerum enim tempore nobis voluptatem animi...",
    icon: "i-heroicons-envelope",
    read: false,
  },
  {
    label: "04/12/2025",
    content:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam, libero voluptates? Molestias rerum enim tempore nobis voluptatem animi...",
    icon: "i-heroicons-envelope",
    read: true,
  },
]);
</script>

<template>
  <div class="h-screen overflow-y-auto">
    <div class="flex items-center py-4 px-4 bg-default text-sm uppercase">
      Messages
    </div>

    <div class="px-4 py-6 space-y-3">
      <MessagesAccordion :items="messages" />
    </div>
  </div>
</template>
