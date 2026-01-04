<script setup>
import axios from "axios";

definePageMeta({
  layout: "secondary",
});

const url = useUrl().url;
const router = useRouter();
const betHistoryData = ref([]);

const betTimeFilter = ref("24 hours");
const betSportFilter = ref("Sports");

watch(betTimeFilter, async (newVal) => {
  await goToBetHistory(newVal);
});

const formattedDate = (d) => {
  const date = new Date(d);
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
};

function calculateTotalOdd(ticket) {
  return ticket.reduce((acc, bet) => acc * bet.odd, 1).toFixed(2);
}

function calculateTicketStatus(bets) {
  let hasPending = false;
  let hasWin = false;

  for (const bet of bets) {
    if (bet.status === 2) {
      return "lose";
    }
    if (bet.status === 0) {
      hasPending = true;
    }
    if (bet.status === 1) {
      hasWin = true;
    }
  }

  if (hasPending) return "pending";
  if (hasWin) return "win";

  return "pending";
}

async function goToBetHistory() {
  let filter = 1;
  if (betTimeFilter.value === "3 days") {
    filter = 3;
  } else if (betTimeFilter.value === "7 days") {
    filter = 7;
  } else if (betTimeFilter.value === "24 hours") {
    filter = 1;
  } else if (betTimeFilter.value === "30 days") {
    filter = 30;
  }

  const res = await axios.get(
    `${url}/api/betHistory?days=${filter}`,

    {
      withCredentials: true,
    }
  );
  betHistoryData.value = res.data.data;
  console.log(res.data);
}

function handleGoBetDetail(id) {
  router.push(`/betinfo/${id}`);
}

const ticketsWithMeta = computed(() => {
  if (!betHistoryData.value.length) return [];

  return betHistoryData.value.map((ticket) => {
    const totalOdd = calculateTotalOdd(ticket);
    const status = calculateTicketStatus(ticket);

    return {
      ticket,
      totalOdd,
      status,
      payout: status === "win" ? (totalOdd * ticket[0].stake).toFixed(2) : "",
    };
  });
});

onMounted(async () => {
  await goToBetHistory();
});
</script>

<template>
  <div
    class="relative h-screen overflow-y-auto w-full md:w-[52%] md:min-w-[600px] px-4 mx-auto mt-2 rounded-t-md"
  >
    <div
      class="text-xs font-light underline absolute top-1 right-6 text-white opacity-80 tracking-wide"
    >
      Clear history
    </div>

    <div class="flex gap-2 px-3 py-4 bg-default">
      <div class="flex flex-col gap-2 flex-1">
        <span class="text-white text-xs font-light tracking-wide">Period</span>
        <SelectInput
          v-model="betTimeFilter"
          :options="['24 hours', '3 days', '7 days', '30 days']"
        />
      </div>
      <div class="flex flex-col gap-2 flex-1">
        <span class="text-white text-xs font-light tracking-wide">Period</span>
        <SelectInput v-model="betSportFilter" :options="['Sports']" />
      </div>
    </div>

    <div class="text-black text-[13px] bg-white grid grid-cols-4">
      <div class="text-center py-4">Type/Date</div>
      <div class="text-center py-4">Amount/Odd</div>
      <div class="text-center py-4">Payout</div>
      <div class="text-center py-4">Status</div>
    </div>

    <div
      v-for="item in betHistoryData"
      :key="item.ticketId"
      @click="handleGoBetDetail(item.ticketId)"
      class="bg-[#eaeaea] grid grid-cols-4 border-b-2 border-black text-black"
    >
      <!-- TYPE -->
      <div class="py-2 flex flex-col items-start px-2 whitespace-nowrap">
        <span class="text-[9px] font-bold">{{ item.ticketId }}</span>

        <span class="text-[11px] font-light">{{
          formattedDate(item.date)
        }}</span>
      </div>

      <!-- STAKE / ODD -->
      <div class="py-2 flex flex-col items-start px-2">
        <span class="text-sm">{{ item.stake.toFixed(2) }}</span>
        <span class="text-sm font-semibold text-[#486333]">
          x {{ item.totalOdds.toFixed(2) }}
        </span>
      </div>

      <!-- PAYOUT -->
      <div
        class="text-center py-2 flex items-center justify-center font-semibold"
        :class="item.status === 1 ? 'text-[#05CD00]' : ''"
      >
        {{ item.status === 1 ? (item.stake * item.totalOdds).toFixed(2) : "" }}
      </div>

      <!-- STATUS ICON -->
      <div class="text-center py-2 flex justify-center items-center">
        <img
          :src="`/icons/${
            item.status === 0 ? 'pending' : item.status === 1 ? 'win' : 'lose'
          }.svg`"
          class="h-4 w-4"
          :alt="item.status"
        />
      </div>
    </div>
  </div>
</template>
