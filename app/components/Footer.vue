<script setup>
import { RouterLink } from "vue-router";
import { t, currentLang } from "@/composables/locales";
const auth = useAuthStore();

const open = ref(false);
const languages = [
  { code: "et", label: "AM", lang: "am" },
  { code: "gb", label: "EN", lang: "en" },
  { code: "orf", label: "OM", lang: "om" },
  { code: "tgr", label: "TG", lang: "tg" },
];

function selectLang(code) {
  open.value = false;
  currentLang.value = code;
}

const isLoggedIn = computed(() => auth.loggedIn);

function handleClickOutside(e) {
  if (!container.value) return;

  // if click is NOT inside the component → close
  if (!container.value.contains(e.target)) {
    open.value = false;
  }
}

const container = ref(null);

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div
    class="p-1 flex items-center justify-around md:flex-col gap-2 w-full relative"
  >
    <div
      class="absolute -top-5 left-1/2 transform -translate-x-1/2 w-28 h-14 rounded-t-full bg-[#486333]"
    ></div>
    <div
      @click="$emit('goToLive')"
      class="flex flex-col gap-1 justify-center items-center"
    >
      <Icon class="text-2xl" name="heroicons:video-camera" />
      <span class="uppercase text-[11px] font-bold tracking-wide">{{
        t("Live")
      }}</span>
    </div>
    <RouterLink
      to="/casino"
      class="flex flex-col gap-1 justify-center items-center"
    >
      <Icon class="text-2xl" name="heroicons:puzzle-piece" />

      <span class="uppercase text-[11px] font-bold tracking-wide">{{
        t("Games")
      }}</span>
    </RouterLink>
    <RouterLink
      to="/auth/login"
      v-if="!isLoggedIn"
      class="flex flex-col gap-1 justify-center items-center z-10 -translate-y-1.5 -translate-x-3"
    >
      <Icon class="text-2xl" name="heroicons:user-circle" />

      <span class="uppercase text-[11px] font-bold tracking-wide z-10">{{
        t("Login")
      }}</span>
    </RouterLink>
    <RouterLink
      to="/payment/deposit"
      v-if="isLoggedIn"
      class="flex flex-col gap-1 justify-center items-center z-10 -translate-y-1.5 -translate-x-1.5"
    >
      <Icon class="text-2xl" name="heroicons:banknotes" />

      <span class="uppercase text-[11px] font-bold tracking-wide z-10">{{
        t("Deposit")
      }}</span>
    </RouterLink>
    <div v-if="false" class="flex flex-col gap-1 justify-center items-center">
      <Icon class="text-2xl" name="heroicons:globe-alt" />

      <span class="uppercase text-[11px] font-bold tracking-wide">EN</span>
    </div>

    <div class="relative inline-block" ref="container">
      <div
        class="flex flex-col gap-1 justify-center items-center"
        @click="open = !open"
      >
        <Icon class="text-2xl" name="heroicons:globe-alt" />

        <span class="uppercase text-[11px] font-bold tracking-wide">EN</span>
      </div>

      <div
        v-if="open"
        class="absolute left-0 -top-30 mt-1 w-16 border border-gray-400 bg-default shadow flex flex-col justify-center items-center gap-1"
      >
        <div
          v-for="lang in languages"
          :key="lang.code"
          class="px-0 py-1 uppercase cursor-pointer hover:bg-gray-100 flex items-center justify-center gap-1 text-xs w-full"
          :class="lang.lang === currentLang ? 'bg-primary text-black' : ''"
          @click="selectLang(lang.lang)"
        >
          <img :src="`/flags/${lang.code}.png`" class="w-5 h-3" alt="" />
          {{ lang.label }}
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-1 justify-center items-center">
      <Icon name="heroicons:chat-bubble-oval-left" class="text-2xl" />

      <span class="uppercase text-[11px] font-bold tracking-wide">{{
        t("chat")
      }}</span>
    </div>
  </div>
</template>
