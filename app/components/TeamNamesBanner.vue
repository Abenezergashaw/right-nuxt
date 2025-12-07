<script setup>
import { useCountryFlag } from "@/composables/useFlags";
import { t } from "@/composables/locales";

const { getFlag } = useCountryFlag();

defineProps({
  teams: String,
  startTime: String,
  competition: String,
  country: String,
});

const router = useRouter();

function goBack() {
  router.back();
}
</script>

<template>
  <div
    class="flex gap-2 items-center px-4 py-3 relative text-black bg-gray-200"
  >
    <div
      class="w-8 h-8 rounded-full flex justify-center items-center bg-default"
    >
      <Icon
        name="heroicons-chevron-left"
        @click="goBack"
        class="w-6 h-6 text-white rounded-full p-1.5 font-semibold"
      />
    </div>
    <div>
      <div class="flex gap-2 items-center text-black">
        <img :src="`/flags/${getFlag(country)}`" alt="" class="w-6 h-4" />

        <span class="text-[12px] opacity-50 font-semibold">{{
          t(competition)
        }}</span>
      </div>
      <span class="font-bold uppercase text-xs">{{ t(teams) }}</span>
    </div>
    <div class="absolute top-1 right-3 text-[12px] opacity-50 text-black">
      {{ startTime }}
    </div>
  </div>
</template>
