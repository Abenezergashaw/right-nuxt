<script setup>
definePageMeta({
  layout: "secondary",
});

const messages = ref([
  {
    label: "04/12/2025",
    content:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam, libero voluptates? Molestias rerum enim tempore nobis voluptatem animi, nesciunt dolore, voluptas unde amet labore veritatis sequi facilis, optio atque excepturi fugit architecto consectetur sapiente ab? Placeat ipsa qui in voluptatibus impedit exercitationem natus distinctio? Dolor error libero assumenda corrupti voluptas?",
    icon: "i-heroicons-envelope",
  },
  {
    label: "04/12/2025",
    content:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam, libero voluptates? Molestias rerum enim tempore nobis voluptatem animi, nesciunt dolore, voluptas unde amet labore veritatis sequi facilis, optio atque excepturi fugit architecto consectetur sapiente ab? Placeat ipsa qui in voluptatibus impedit exercitationem natus distinctio? Dolor error libero assumenda corrupti voluptas?",
    icon: "i-heroicons-envelope",
  },
  {
    label: "04/12/2025",
    content:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam, libero voluptates? Molestias rerum enim tempore nobis voluptatem animi, nesciunt dolore, voluptas unde amet labore veritatis sequi facilis, optio atque excepturi fugit architecto consectetur sapiente ab? Placeat ipsa qui in voluptatibus impedit exercitationem natus distinctio? Dolor error libero assumenda corrupti voluptas?",
    icon: "i-heroicons-envelope",
  },
  {
    label: "04/12/2025",
    content:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam, libero voluptates? Molestias rerum enim tempore nobis voluptatem animi, nesciunt dolore, voluptas unde amet labore veritatis sequi facilis, optio atque excepturi fugit architecto consectetur sapiente ab? Placeat ipsa qui in voluptatibus impedit exercitationem natus distinctio? Dolor error libero assumenda corrupti voluptas?",
    icon: "i-heroicons-envelope",
  },
  {
    label: "04/12/2025",
    content:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam, libero voluptates? Molestias rerum enim tempore nobis voluptatem animi, nesciunt dolore, voluptas unde amet labore veritatis sequi facilis, optio atque excepturi fugit architecto consectetur sapiente ab? Placeat ipsa qui in voluptatibus impedit exercitationem natus distinctio? Dolor error libero assumenda corrupti voluptas?",
    icon: "i-heroicons-envelope",
  },
]);
</script>

<template>
  <div class="h-screen overflow-y-auto">
    <div class="flex items-center py-6 px-4 bg-default text-xl uppercase">
      Messages
    </div>

    <div class="px-4 py-6">
      <UAccordion :items="messages" class="text-black" />
    </div>
  </div>
</template>
