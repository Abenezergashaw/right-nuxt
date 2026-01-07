<script setup>
import axios from "axios";
import { ref } from "vue";
definePageMeta({ layout: "secondary" });

const route = useRoute();
const ticket = useTicket();
const general = useGeneral();
const auth = useAuthStore();

const singleGame = ref(null);
const currentGameDetail = ref(null);
const activeSelection = ref("Main");
const opendMarkets = ref([0, 1]);
const loader = ref(false);
const ticketData = computed(() => ticket.ticket);
const eventStartTime = ref(null);

const url = useUrl().url;

const stake = computed(() => general.stake);
const placingBet = ref(false);
const fastBetCode = ref(null);
const betSuccessful = ref(false);
const placingBetError = ref(null);
const fastBetModal = ref(false);
const withPoints = ref(false);

const ticketNumber = ref("");
const ticketHolder = ref([]);
const ticketNumberHolder = ref(null);
const stakeHolder = ref(null);
const timeHolder = ref(null);
const userHolder = ref(null);

const totalOdds = computed(() => {
  return ticketData.value.reduce(
    (acc, b) => (acc * b.price_rate).toFixed(2),
    1
  );
});

const possibleWin = computed(() => {
  return ticketData.value.length
    ? (stake.value * totalOdds.value).toFixed(2)
    : 0;
});

async function handleFastBetting() {
  placingBet.value = true;
  const res = await axios.post(`${url}/api/placeFastBet`, {
    tickets: ticketData.value,
    stake: stake.value,
  });
  if (!res.data.error) {
    fastBetCode.value = res.data.fastBetId;
    placingBet.value = false;
    fastBetModal.value = true;
  }
}

async function handlePlaceBetsOnline() {
  placingBet.value = true;
  placingBetError.value = null;
  ticketHolder.value = ticket.ticket;

  const res = await axios.post(
    `${url}/api/placeBets`,
    {
      tickets: ticketData.value,
      stake: stake.value,
      withPoints: withPoints.value,
    },
    {
      withCredentials: true,
    }
  );
  if (res.data.error) {
    placingBet.value = false;
    placingBetError.value = res.data.message;
    const errorBets =
      Array.isArray(res.data?.data) && res.data.data.length > 0
        ? res.data.data || []
        : [];
    errorBets.forEach((s) => {
      const t = ticket.ticket.find((x) => x.reference_id === s.reference_id);
      if (t) t.errors = s.errors;
    });

    return;
  }

  if (!res.data.error) {
    ticket.ticket = [];
    ticketNumberHolder.value = res.data.ticketId;
    timeHolder.value = res.data.betAt;
    stakeHolder.value = general.stake;
    userHolder.value = res.data.user;
    general.stake = 10;
    placingBet.value = false;
    betSuccessful.value = true;
    const ok = await auth.checkSession();
  } else {
    const errorBets = res.data[0].data.bets;
  }
}

function handleToggleWithPoints(val) {
  withPoints.value = !withPoints.value;
}

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

    eventStartTime.value = singleGame.value?.events[0].eventStartTime;

    currentGameDetail.value = collections.value[0] || {};

    currentGameDetail.value.markets = currentGameDetail.value.markets.filter(
      (m) =>
        [
          "Match Result",
          "Double Chance",
          "Both Teams to Score",
          "Correct Score",
          "Goals Odd/Even",
          "Half Time/Full Time",
        ].includes(m.marketName)
    );
    activeSelection.value = collections.value[0]?.collectionName || "Main";
  } catch (err) {
    console.error("Game load error:", err);
  } finally {
    loader.value = false;
  }
}

// --- computed selections ---
const selectionLists = computed(() => {
  const allowedSet = new Set([
    "Main",
    "Goals",
    "Handicap",
    "Double Bets",
    "1st Half",
    "2nd Half",
    "Corners",
    "Yellow Cards",
  ]);

  return collections.value
    .filter((c) => allowedSet.has(c.collectionName))
    .map((c) => c.collectionName);
});

// --- handlers ---
function handleChangeSelection(item) {
  activeSelection.value = item;
  opendMarkets.value = [0, 1];
  currentGameDetail.value =
    collections.value.find((c) => c.collectionName === item) || {};

  let filters = [];

  if (item === "Main") {
    filters = [
      "Match Result",
      "Double Chance",
      "Both Teams to Score",
      "Correct Score",
      "Goals Odd/Even",
      "Half Time/Full Time",
    ];
  } else if (item === "Goals") {
    filters = [
      "Total Goals",
      "Home Team Total Goals",
      "Away Team Total Goals",
      "Home Team to Score a Goal",
      "Away Team to Score a Goal",
    ];
  } else if (item === "Handicap") {
    filters = ["Handicap"];
  } else if (item === "Double Bets") {
    filters = [
      "Match Result/Both Teams To Score",
      "Double Chance/Both Teams To Score",
      "Match Result/Total Goals",
      "Double Chance/Total Goals",
      "Both Teams To Score/Total Goals",
    ];
  } else if (item === "1st Half") {
    filters = [
      "1st Half Result",
      "1st Half Double Chance",
      "1st Half Total Goals",
    ];
  } else if (item === "2nd Half") {
    filters = [
      "2nd Half Result",
      "2nd Half Double Chance",
      "2nd Half Total Goals",
    ];
  } else if (item === "Corners") {
    filters = [
      "Corners Result",
      "Corners Double Chance",
      "Total Corners",
      "Home Team Total Corners",
      "Away Team Total Corners",
      "1st Half Corners Result",
      "1st Half Total Corners",
      "2nd Half Total Corners",
    ];
  } else if (item === "Yellow Cards") {
    filters = [
      "Yellow Cards Result",
      "Total Yellow Cards",
      "Home Team Total Yellow Cards",
      "Away Team Total Yellow Cards",
    ];
  }
  currentGameDetail.value.markets = currentGameDetail.value.markets.filter(
    (m) => filters.includes(m.marketName)
  );
}

function handleOpenCloseMarket(index) {
  const i = opendMarkets.value.indexOf(index);
  if (i === -1) opendMarkets.value.push(index);
  else opendMarkets.value.splice(i, 1);
}

function passBetSelection(bet) {
  const t = { ...bet, startTime: eventStartTime.value, sportId };
  ticket.manageSelectedBet(t);
}

async function checkTicket() {
  if (!ticketNumber.value) return;

  const res = await axios.get(
    `${url}/api/getFastTickets?ticketId=${ticketNumber.value}`
  );

  if (!res.data.error) {
    ticket.ticket = res.data.ticket;
    general.stake = res.data.stake;
  }
}

function repeatBet() {
  betSuccessful.value = false;
  ticket.ticket = ticketHolder.value;
}

onBeforeMount(goIntoGameDetails);
</script>

<template>
  <Loader :loader="loader" />

  <div class="block md:flex gap-4 justify-center">
    <div class="w-full md:w-[52%] md:px-4 h-screen overflow-y-auto">
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
        :country="country"
        :competition="competition"
        @openCloseMarket="handleOpenCloseMarket"
        @betSelected="passBetSelection"
      />
    </div>

    <div
      class="bg-gray-100 w-[30%] max-h-[80vh] overflow-y-auto rounded-lg hidden mt-2 md:block md:px-4"
    >
      <div v-if="ticket.ticket.length > 0">
        <main class="flex-1">
          <div class="flex gap-1 items-center p-2">
            <Icon
              name="heroicons-information-circle"
              class="w-10 h-10"
              style="color: var(--ui-bg)"
            />
            <span class="text-xs font-bold" style="color: var(--ui-bg)"
              >Current bonus is {{ ticket.currentBonus }}%, one more selection
              will give you {{ ticket.nextBonus }}%</span
            >
          </div>

          <SingleBet
            :tickets="ticketData"
            @removeGameFromTicket="handleRemoveGame"
          />
        </main>
        <div class="text-black">
          <TicketData
            :totalOdds="totalOdds"
            :possibleWin="possibleWin"
            :point="ticket.currentBonus"
            :placingBet="placingBet"
            :placingBetError="placingBetError"
            :bBalance="bBalance"
            :withPoints="withPoints"
            @emptyBets="handleClearingBets"
            @placeBetsOnline="handlePlaceBetsOnline"
            @fastBet="handleFastBetting"
            @toggleWithPoints="handleToggleWithPoints"
          />
        </div>
      </div>

      <div v-else-if="betSuccessful" class="border rounded-xl p-4 space-y-4">
        <div class="text-green-700 font-semibold text-sm text-center">
          Bet placed successfully
        </div>

        <div class="flex flex-col gap-3">
          <button
            @click="repeatBet"
            class="px-4 w-full py-2 rounded-lg bg-default text-white text-sm font-medium hover:bg-opacity-90 transition cursor-pointer"
          >
            Repeat Bet
          </button>

          <button
            @click="
              ticket.printBetTicket(
                ticketHolder,
                stakeHolder,
                ticketNumberHolder,
                timeHolder,
                userHolder
              )
            "
            class="px-4 w-full py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 transition cursor-pointer"
          >
            Print Slip
          </button>
        </div>
      </div>

      <div v-else class="text-black p-2">
        <div class="flex gap-2">
          <input
            id="ticket"
            v-model="ticketNumber"
            type="text"
            placeholder="Enter ticket to load"
            class="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-default focus:border-default"
          />

          <button
            @click="checkTicket"
            class="rounded-lg bg-default px-5 py-2 text-sm cursor-pointer hover:opacity-80 font-semibold text-white hover:bg-opacity-90 transition"
          >
            Check
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
