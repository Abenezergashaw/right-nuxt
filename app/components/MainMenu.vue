<script setup lang="ts">
import { ref } from "vue";
import { t } from "@/composables/locales";

// Menu items with icon and label
const sportItems = [
  {
    label: "Sport",
    icon: "https://arada.bet/files/webexIconsMobile/image/sportBar/ball.svg",
    to: "/sport/events/countries",
  },
  //   { label: "Live", icon: "https://arada.bet/files/webexIconsMobile/image/sportBar/liveNew.svg", to: "/" },
  {
    label: "Games",
    icon: "https://arada.bet/files/webexIconsMobile/image/sportBar/casino.svg",
    to: "/casino",
  },
  {
    label: "Live Games",
    icon: "https://arada.bet/files/webexIconsMobile/image/sportBar/liveCasino.svg",
    to: "/casino",
  },
  {
    label: "Virtual Sport",
    icon: "https://arada.bet/files/webexIconsMobile/image/header/gray/virtual_sport-dark.svg",
    to: "/virtualsport",
  },
  {
    label: "Tennis",
    icon: "https://arada.bet/files/webexIconsMobile/image/sportBar/tennis.svg",
    to: "/sport/events/countries?game=Tennis",
  },
  {
    label: "Basketball",
    icon: "https://arada.bet/files/webexIconsMobile/image/sportBar/basketball.svg",
    to: "/sport/events/countries?game=Basketball",
  },
  {
    label: "Rugby",
    icon: "https://arada.bet/files/webexIconsMobile/image/sportBar/rugby.svg",
    to: "/sport/events/countries?game=Rugby League",
  },
  {
    label: "Volleyball",
    icon: "https://arada.bet/files/webexIconsMobile/image/sportBar/volleyball.svg",
    to: "/sport/events/countries?game=Volleyball",
  },
];

// Optional: active index for highlighting
const activeIndex = ref<number | null>(null);

const setActive = (index: number) => {
  activeIndex.value = index;
};
</script>

<template>
  <ul
    class="sport-bar__list flex overflow-x-auto gap-0 p-2 border-b border-primary"
  >
    <li
      v-for="(item, index) in sportItems"
      :key="item.label"
      :class="['sport-bar__item', { active: activeIndex === index }]"
      @click="setActive(index)"
    >
      <RouterLink
        :to="item.to"
        class="sport-bar__button flex flex-col items-center justify-center p-2 cursor-pointer border-r-2 border-gray-800 px-6 bg-gray-200"
      >
        <span class="sport-bar__icon block w-6 h-6">
          <img
            :src="item.icon"
            :alt="`${item.label} icon`"
            class="sport-bar__icon-svg w-full h-full object-contain"
          />
        </span>
        <span class="sport-bar__text mt-1 text-xs text-black font-semibold">{{
          t(item.label)
        }}</span>
      </RouterLink>
    </li>
  </ul>
</template>

<style scoped>
.sport-bar__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.sport-bar__item {
  flex: 0 0 auto;
}

/* .sport-bar__button {
  transition: transform 0.2s;
}

.sport-bar__button:hover {
  transform: scale(1.1);
} */

/* .sport-bar__item.active .sport-bar__button {
  border-bottom: 2px solid #f59e0b; /* highlight color 
} */
</style>
