<script setup>
import UpcomingGamesFilter from "~/components/UpcomingGamesFilter.vue";
import axios from "axios";
import { ref, Teleport } from "vue";
import { t } from "@/composables/locales";

definePageMeta({
  layout: "secondary",
});

const url = useUrl().url;
const ticket = useTicket();

const gameData = ref(null);
const loader = ref(false);

const ticketData = computed(() => ticket.ticket);

const currentUpcomingGameFilter = ref("All");

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getDateOffset(offset) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return formatDate(date);
}

const FILTERS = {
  All: { start: -1, end: 0 },
  Today: { start: -1, end: 0 },
  Tomorrow: { start: 0, end: 1 },
  After: { start: 1, end: 2 },
};

async function getUpcomingEvents(filter = "All") {
  loader.value = true;
  const f = FILTERS[filter];

  const start = getDateOffset(f.start);
  const end = getDateOffset(f.end);

  const res = await axios.post(`${url}/api/upcomingEvents`, { start, end });

  if (!res.data.error) {
    gameData.value =
      res.data?.[0]?.data?.mainEventList?.[0]?.competitions ?? [];
    loader.value = false;
  }
}

async function changeFilter(filter) {
  currentUpcomingGameFilter.value = filter;
  await getUpcomingEvents(filter);
}

async function manageSelectedBet(bet) {
  ticket.manageSelectedBet(bet);
}

onMounted(() => {
  getUpcomingEvents("All");
});
</script>

<template>
  <ImageCarousel />
  <SecondaryMenu middleGameInfoState="Upcoming" />

  <div class="flex gap-2 justify-end my-1 px-4">
    <UpcomingGamesFilter
      v-for="item in ['All', 'Today', 'Tomorrow', 'After']"
      :key="item"
      :title="item"
      :current="currentUpcomingGameFilter"
      @click="changeFilter(item)"
    />
  </div>

  <Loader :loader="loader" />

  <div v-for="(g, i) in gameData" :key="g.competitionId || i">
    <SingleGameList
      :game="g"
      :ticketData="ticketData"
      @betSelected="manageSelectedBet"
    />
  </div>
</template>
