<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { t } from "@/composables/locales";

const url = useUrl().url;
const ticket = useTicket();

definePageMeta({
  layout: "secondary",
});

const route = useRoute();
const router = useRouter();

const leaguesData = ref([]); // FIXED
const ticketData = computed(() => ticket.ticket);

const loader = ref(false);

const leagueParams = route.params.league;

const sportId = leagueParams[0];
const country = leagueParams[1];
const competition = leagueParams[2];
const currentSport = leagueParams[3];

function goBack() {
  router.back();
}

async function goIntoLeagueGames(country, competition, sportId) {
  loader.value = true;
  const res = await axios.post(`${url}/api/gamesByLeagues`, {
    country,
    competition,
    sportId,
  });

  if (!res.data.error) {
    leaguesData.value = res.data[0]?.data?.eventList?.[0]?.competitions ?? [];
    loader.value = false;
  }
}

async function manageSelectedBet(bet) {
  ticket.manageSelectedBet(bet);
}

onMounted(() => {
  goIntoLeagueGames(country, competition, sportId);
});
</script>

<template>
  <Loader :loader="loader" />
  <div class="px-4">
    <div
      class="py-6 uppercase text-[#486333] font-bold flex gap-2 items-center text-lg"
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

      <span>
        {{ t(currentSport) }} - {{ t(country) }} -
        {{ t(competition) }}
      </span>
    </div>
    <USeparator />

    <div v-for="g in leaguesData">
      <SingleGameList2
        @betSelected="manageSelectedBet"
        :game="g"
        :ticketData="ticketData"
        :sport="currentSport"
        :sportId="sportId"
      />
    </div>
  </div>
</template>
