<script setup>
import { computed } from "vue";

const props = defineProps({
  checkTicketData: {
    type: Array,
    required: true,
  },
});

const totalOdds = computed(() => {
  return props.checkTicketData.reduce((acc, bet) => acc * Number(bet.odd), 1);
});

const a = "pending";

const status = computed(() => {
  let hasPending = false;
  let hasWin = false;

  for (const bet of props.checkTicketData) {
    if (bet.status === 2) return "lose";
    if (bet.status === 0) hasPending = true;
    if (bet.status === 1) hasWin = true;
  }

  if (hasPending) return "pending";
  if (hasWin) return "win";

  return "pending";
});

const winning = computed(() => {
  if (status.value === "win" || status.value === "pending") {
    return totalOdds.value * props.checkTicketData[0].stake;
  }
  return 0;
});

const tax = computed(() => {
  return winning.value > 1000 ? winning.value * 0.15 : 0;
});

const netWinning = computed(() => {
  return winning.value > 1000 ? winning.value * 0.85 : winning.value;
});

const getImageSource = (status) => {
  if (status === 0) return "pending";
  else if (status === 1) return "win";
  else if (status === 2) return "lose";
};
</script>
<template>
  <div class="bg-[#ededed] px-2 pb-2 text-black">
    <div class="h-10 border-y border-black flex items-center justify-between">
      <span class="text-[12px] uppercase">Deposit</span>
      <span class="text-[12px] uppercase font-bold">
        {{ checkTicketData[0].stake }} ETB
      </span>
    </div>

    <div class="h-10 border-b border-black flex items-center justify-between">
      <span class="text-[12px] uppercase">total odds</span>
      <span class="text-[12px] uppercase font-bold">
        {{ totalOdds.toFixed(2) }}
      </span>
    </div>

    <div class="h-10 border-b border-black flex items-center justify-between">
      <span class="text-[12px] uppercase">
        {{ status === "win" ? "won amount" : "possible winning" }}
      </span>
      <span class="text-[12px] uppercase font-bold">
        {{ netWinning.toFixed(2) }} ETB
      </span>
    </div>

    <div class="h-10 border-b border-black flex items-center justify-between">
      <span class="text-[12px] uppercase">tax</span>
      <span class="text-[12px] uppercase font-bold">
        {{ tax.toFixed(2) }} ETB
      </span>
    </div>

    <div
      v-for="b in checkTicketData"
      :key="b.id"
      class="relative bg-white py-2 px-2 border-b-2 border-gray-500"
    >
      <div class="flex flex-col font-semibold uppercase text-[12px]">
        <span>{{ b.teams.split(/ v /i)[0] }}</span>
        <span>{{ b.teams.split(/ v /i)[1] }}</span>
      </div>

      <div class="flex justify-between items-center gap-2 text-[11px] py-1">
        <div class="flex flex-col w-[35%]">
          <span>{{ b.market }}</span>
          <span class="font-semibold"
            >{{ b.priceName
            }}{{ b.priceHCap == 0 ? "" : "(" + b.priceHCap + ")" }}</span
          >
        </div>

        <div class="flex-1">
          <span>Competition Name</span>
        </div>

        <div class="flex items-center gap-1 font-bold text-[#486333]">
          <span>{{ b.odd }}</span>

          <img
            alt="pending"
            :src="`/icons/${getImageSource(b.status)}.svg`"
            class="h-4 w-4"
          />
        </div>
      </div>
    </div>
  </div>
</template>
