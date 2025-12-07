<script setup>
definePageMeta({
  layout: "secondary",
});

const router = useRouter();

onMounted(() => {
  router.push("/home/upcoming");
});
</script>

<template>
  <div>Home</div>
</template>
