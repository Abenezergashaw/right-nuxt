<script setup>
import axios from "axios";
import { ref } from "vue";
definePageMeta({ layout: "secondary" });

const route = useRoute();
const ticket = useTicket();

const singleGame = ref(null);
const currentGameDetail = ref(null);
const activeSelection = ref("Main");
const opendMarkets = ref([0, 1]);
const loader = ref(false);
const ticketData = computed(() => ticket.ticket);

const url = useUrl().url;

// --- parse params cleanly ---
const gameParams = route.params.game;

const last = route.params.game.at(-1);
const eventId = last.split("_id")[1];
const sportId = gameParams[1];
const country = gameParams[2];
const competition = gameParams[3];

// --- computed shortcuts ---
const collections = computed(
  () => singleGame.value?.events?.[0]?.collections || []
);

// --- API call ---
async function goIntoGameDetails() {
  try {
    loader.value = true;

    const res = await axios.post(`${url}/api/gameDetails`, {
      sportId: sportId,
      country: country,
      competition: competition,
      eventId: eventId,
    });

    const comp = res.data[0].data.eventList[0].competitions[0];
    singleGame.value = comp;

    currentGameDetail.value = collections.value[0] || {};
    activeSelection.value = collections.value[0]?.collectionName || "Main";
  } catch (err) {
    console.error("Game load error:", err);
  } finally {
    loader.value = false;
  }
}

// --- computed selections ---
const selectionLists = computed(() =>
  collections.value.map((c) => c.collectionName)
);

// --- handlers ---
function handleChangeSelection(item) {
  activeSelection.value = item;
  opendMarkets.value = [0, 1];
  currentGameDetail.value =
    collections.value.find((c) => c.collectionName === item) || {};
}

function handleOpenCloseMarket(index) {
  const i = opendMarkets.value.indexOf(index);
  if (i === -1) opendMarkets.value.push(index);
  else opendMarkets.value.splice(i, 1);
}

function passBetSelection(bet) {
  ticket.manageSelectedBet(bet);
}

onBeforeMount(goIntoGameDetails);
</script>

<template>
  <Loader :loader="loader" />

  <div>
    <TeamNamesBanner
      :country="country"
      :competition="competition"
      :teams="singleGame?.events[0]?.eventName"
      :startTime="formattedDate"
    />
    <SelectionsBanner
      :selections="selectionLists"
      :activeSelection="activeSelection"
      @changeSelection="handleChangeSelection"
    />

    <SingleGameDetails
      :gameDetail="currentGameDetail ?? {}"
      :opendMarkets="opendMarkets"
      :activeSelection="activeSelection"
      :teams="singleGame?.events[0].eventName"
      :eventId="singleGame?.events[0].eventId"
      :ticketData="ticketData"
      @openCloseMarket="handleOpenCloseMarket"
      @betSelected="passBetSelection"
    />
  </div>
</template>
