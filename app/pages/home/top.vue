<script setup>
import UpcomingGamesFilter from "~/components/UpcomingGamesFilter.vue";
import axios from "axios";
import { ref, nextTick } from "vue";

definePageMeta({
  layout: "secondary",
});

// const url = useUrl().url;
// const ticket = useTicket();

// const gameData = ref(null);
// const loader = ref(false);

// const ticketData = computed(() => ticket.ticket);

const url = useUrl().url;
const ticket = useTicket();
const general = useGeneral();
const auth = useAuthStore();

const gameData = ref(null);
const loader = ref(false);

const ticketData = computed(() => ticket.ticket);
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

onMounted(async () => {
  getTopSports();
});
</script>

<template>
  <div class="block md:flex gap-4 justify-center">
    <div class="w-full md:w-[52%] md:px-4 h-screen overflow-y-auto">
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
