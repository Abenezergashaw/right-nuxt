<script setup>
import UpcomingGamesFilter from "~/components/UpcomingGamesFilter.vue";
import axios from "axios";
import { ref, nextTick } from "vue";

definePageMeta({
  layout: "secondary",
});

const url = useUrl().url;
const ticket = useTicket();

const gameData = ref(null);
const loader = ref(false);

const ticketData = computed(() => ticket.ticket);

async function getTopSports() {
  loader.value = true;
  const res = await axios.post(`${url}/api/topSports`, {});

  if (!res.data.error) {
    gameData.value =
      res.data?.[0]?.data?.mainEventList?.[0]?.competitions ?? [];
    await nextTick;
    loader.value = false;
  }
}

async function manageSelectedBet(bet) {
  ticket.manageSelectedBet(bet);
}

onMounted(async () => {
  getTopSports();
});
</script>

<template>
  <ImageCarousel />
  <SecondaryMenu middleGameInfoState="topSports" />

  <Loader :loader="loader" />

  <div v-for="(g, i) in gameData" :key="g.competitionId || i">
    <SingleGameList
      :game="g"
      :ticketData="ticketData"
      @betSelected="manageSelectedBet"
    />
  </div>
</template>
