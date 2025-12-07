<script setup>
import Default from "@/layouts/default.vue";
import Bbb from "~/components/MainMenu.vue";
import axios from "axios";

const ticket = useTicket();
const url = useUrl().url;
const general = useGeneral();
const auth = useAuthStore();

const ticketData = computed(() => ticket.ticket);
const stake = computed(() => general.stake);
const placingBet = ref(false);
const fastBetCode = ref(null);
const betSuccessful = ref(false);
const placingBetError = ref(null);
const fastBetModal = ref(false);
const withPoints = ref(false);

const totalOdds = computed(() => {
  return ticketData.value.reduce(
    (acc, b) => (acc * b.price_rate).toFixed(2),
    1
  );
});

async function handleFastBetting() {
  placingBet.value = true;
  const res = await axios.post(`${url}/api/placeFastBet`, {
    tickets: ticketData.value,
    stake: stake.value,
  });
  if (!res.data.error) {
    fastBetCode.value = res.data[0].data.packageId;
    placingBet.value = false;
    fastBetModal.value = true;
  }
}

async function handlePlaceBetsOnline() {
  placingBet.value = true;
  placingBetError.value = null;

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
        ? res.data.data[0].data?.bets || []
        : [];
    errorBets.forEach((s) => {
      const t = ticketData.value.find((x) => x.reference_id === s.reference_id);
      if (t) t.errors = s.errors;
    });
    return;
  }

  if (!res.data.error) {
    ticket.ticket = [];
    if (ticketData.value.length === 0) {
      general.stake = 10;
      placingBet.value = false;
      const ok = await auth.checkSession();
      betSuccessful.value = true;

      setTimeout(() => {
        betSuccessful.value = false;
      }, 3000);
    }
  } else {
    const errorBets = res.data[0].data.bets;
  }
}

function handleToggleWithPoints(val) {
  withPoints.value = !withPoints.value;
}
</script>

<template>
  <UModal v-model:open="fastBetModal">
    <template #content>
      <div
        class="bg-[#476136] shadow-lg w-11/12 h-80 max-w-md py-6 px-1 relative"
      >
        <UButton
          class="absolute top-0 -right-5 text-gray-100 text-lg"
          v-on:click="
            fastBetModal = false;
            fastBetCode = null;
          "
          size="xl"
          color="neutral"
          variant="ghost"
          icon="i-lucide-x"
        />

        <div class="flex flex-col gap-2 justify-center items-center text-white">
          <img
            src="https://arada.bet/files/webexIconsDesktop/assets/image/logo/logo-VAMOSETH.svg"
            class="w-20"
            alt=""
          />
          <span>Fast Bet Code</span>
          <span class="text-2xl tracking-wide">{{ fastBetCode }}</span>
          <span class="text-center">
            This is Temporary Ticket, and you can use this ticket for placing
            bet in any Right Shop.
          </span>
        </div>
      </div>
    </template>
  </UModal>

  <div class="flex flex-col h-dvh">
    <Default />

    <!-- Extra content only for this secondary layout -->
    <Bbb />

    <!-- Page content -->
    <main class="flex-1 overflow-y-auto py-0 bg-gray-200">
      <UContainer class="px-0">
        <slot />
      </UContainer>
      <FooterInfo />
    </main>

    <Footer v-if="ticketData.length === 0 && !betSuccessful" />

    <div
      v-else-if="ticketData.length === 0 && betSuccessful"
      class="h-10 text-center font-bold text-white flex items-center justify-center relative"
    >
      Bet Accepted
      <RouterLink
        to="/bethistory"
        class="absolute right-2 text-[10px] opacity-80 whitespace-pre-line w-10"
        >Bet History</RouterLink
      >
    </div>
    <TicketDataFooter
      v-else
      :tickets="ticketData.length"
      :totalOdds="totalOdds"
      :point="ticket.currentBonus"
      :placingBet="placingBet"
      :placingBetError="placingBetError"
      :withPoints="withPoints"
      @fastBet="handleFastBetting"
      @placeBetsOnline="handlePlaceBetsOnline"
      @toggleWithPoints="handleToggleWithPoints"
    />
  </div>
</template>
