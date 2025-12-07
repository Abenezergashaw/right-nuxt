<script setup>
import { computed, ref } from "vue";
import TeamNamesBanner from "./TeamNamesBanner.vue";
import SelectionsBanner from "./SelectionsBanner.vue";
import SingleGameDetails from "./SingleGameDetails.vue";

const props = defineProps({
  game: Object,
  ticketData: Array,
});

const emit = defineEmits();

const formattedDate = computed(() => {
  const date = new Date(props.game.events[0].eventStartTime);
  const options = {
    timeZone: "Africa/Addis_Ababa",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  return new Intl.DateTimeFormat("en-GB", options)
    .format(date)
    .replace(",", "");
});

setTimeout(() => {
  console.log(formattedDate.value);
}, 3000);
const selectionLists = computed(
  () => props.game?.events?.[0]?.collections?.map((s) => s.collectionName) || []
);

const currentGameDetail = ref(props.game?.events?.[0]?.collections[0]);
const activeSelection = ref("Main");
const opendMarkets = ref([0, 1]);

function handleChangeSelection(item) {
  activeSelection.value = item;
  opendMarkets.value = [0, 1];
  currentGameDetail.value = props.game?.events?.[0]?.collections.filter(
    (c) => c.collectionName === item
  )[0];
}

function handleOpenCloseMarket(index) {
  const exists = opendMarkets.value.indexOf(index);
  if (exists === -1) {
    opendMarkets.value.push(index);
  } else {
    opendMarkets.value.splice(exists, 1);
  }
}

function passBetSelection(bet, id) {
  emit("betSelected", bet, id);
}
</script>

<template>
  <TeamNamesBanner
    :country="game.country"
    :competition="game.competitionName"
    :teams="game.events[0].eventName"
    :startTime="formattedDate"
    @goBackToGameList="$emit('goBackToGameList')"
  />
  <SelectionsBanner
    :selections="selectionLists"
    :activeSelection="activeSelection"
    @changeSelection="handleChangeSelection"
  />
  <SingleGameDetails
    :gameDetail="currentGameDetail"
    :opendMarkets="opendMarkets"
    :activeSelection="activeSelection"
    :teams="game.events[0].eventName"
    :eventId="game.events[0].eventId"
    :ticketData="ticketData"
    @openCloseMarket="handleOpenCloseMarket"
    @betSelected="passBetSelection"
  />
</template>
