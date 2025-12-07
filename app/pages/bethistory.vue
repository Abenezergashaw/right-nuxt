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

  const res = await axios.post(
    `${url}/api/betHistory`,
    {
      timeFrame: filter,
    },
    {
      withCredentials: true,
    }
  );
  betHistoryData.value = res.data;
}

function handleGoBetDetail(id) {
  router.push(`/betinfo/${id}`);
}

onMounted(async () => {
  await goToBetHistory();
});
</script>

<template>
  <div class="relative h-screen overflow-y-auto">
    <div
      class="text-xs font-light underline absolute top-1 right-2 text-white opacity-80 tracking-wide"
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
      v-if="betHistoryData.length > 0"
      v-for="ticket in betHistoryData"
      :key="ticket.id"
      @click="handleGoBetDetail(ticket.id)"
      class="bg-[#eaeaea] grid grid-cols-4 border-b-2 border-black text-black"
    >
      <div class="py-2 flex flex-col items-start px-2 whitespace-nowrap">
        <span class="font-semibold text-sm">{{
          ticket.type === 0 ? "Single" : "AKO"
        }}</span>
        <span class="text-[11px] font-light whitespace-nowrap">
          {{ formattedDate(ticket.date) }}
        </span>
      </div>

      <div class="py-2 flex flex-col items-start px-2">
        <span class="text-sm">{{ ticket.sum }}</span>
        <span class="text-sm font-semibold text-[#486333] whitespace-nowrap"
          >x {{ ticket.total_odds }}</span
        >
      </div>

      <div
        class="text-center py-2 flex items-center justify-center font-semibold"
        :class="`${
          ticket.payout === '0.00' ? 'text-red-500' : 'text-green-500'
        }`"
      >
        {{ ticket.payout ? ticket.payout : "" }}
      </div>

      <div class="text-center py-2 flex justify-center items-center">
        <img
          v-if="ticket.meta.ststatus === 0"
          src="/icons/pending.svg"
          class="h-4 w-4"
          alt=""
        />
        <img
          v-else-if="ticket.meta.ststatus === 2"
          src="/icons/win.svg"
          class="h-4 w-4"
          alt=""
        />
        <img v-else src="/icons/lose.svg" class="h-4 w-4" alt="" />
      </div>
    </div>
  </div>
</template>
