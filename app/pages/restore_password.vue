<script setup>
definePageMeta({
  layout: "tertiary",
});
</script>

<template>
  <div
    class="h-screen overflow-y-auto text-black px-2 flex flex-col items-center gap-10 text-center pt-10"
  >
    <div>
      If you have forgotten your password, you can reset it via out telegram
      bot.
    </div>
    <a
      href="https://t.me/right_et_bot"
      target="_blank"
      class="flex flex-col items-center gap-1"
    >
      <img src="/icons/telegram.svg" class="w-10 h-10" alt="" />
      <div class="text-[#486333]">@right_et_bot</div>
    </a>
  </div>
</template>
