<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  checkTicketData: Object,
});

const formattedDate = (d) => {
  const date = new Date(d);
  const options = {
    timeZone: "Africa/Addis_Ababa",
    day: "2-digit",
    month: "2-digit",
    // year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  return new Intl.DateTimeFormat("en-GB", options)
    .format(date)
    .replace(",", "");
};
</script>
<template>
  <div class="bg-[#ededed] px-2 pb-2 text-black">
    <div class="h-10 border-y border-black flex items-center justify-between">
      <span class="text-[12px] uppercase">Deposit</span>
      <span class="text-[12px] uppercase font-bold"
        >{{ checkTicketData?.amount }} ETB</span
      >
    </div>
    <div class="h-10 border-b border-black flex items-center justify-between">
      <span class="text-[12px] uppercase">total odds</span>
      <span class="text-[12px] uppercase font-bold">{{
        checkTicketData?.total_odds
      }}</span>
    </div>
    <div class="h-10 border-b border-black flex items-center justify-between">
      <span class="text-[12px] uppercase">possible winning</span>
      <span class="text-[12px] uppercase font-bold"
        >{{ checkTicketData?.total_winning }} ETB</span
      >
    </div>
    <div class="h-10 border-b border-black flex items-center justify-between">
      <span
        v-if="
          checkTicketData?.total_winning !== '0.00' &&
          checkTicketData?.possible_tax !== '0.00'
        "
        class="text-[12px] uppercase"
        >tax</span
      >
      <span
        v-if="
          checkTicketData?.total_winning !== '0.00' &&
          checkTicketData?.possible_tax !== '0.00'
        "
        class="text-[12px] uppercase font-bold"
        >{{ checkTicketData?.possible_tax }} ETB</span
      >
    </div>

    <button
      v-if="checkTicketData?.copybet?.valid && false"
      class="uppercase bg-[#77A2D9] text-white text-[11px] px-3 rounded font-bold py-2 my-2"
    >
      copy bet
    </button>
    <div
      v-for="b in checkTicketData?.bets"
      class="relative bg-white py-2 px-2 border-b-2 border-gray-500"
    >
      <span class="absolute top-1 right-2 text-[11px] font-light">
        {{ formattedDate(b.event_start_time_nf) }}
      </span>
      <span class="absolute top-6 right-2 text-[13px] font-base">
        {{ b.score ? b.score : "" }}
      </span>
      <div class="flex flex-col font-semibold uppercase text-[12px]">
        <span>{{ b.event_name.split(/ v /i)[0] }}</span>
        <span>{{ b.event_name.split(/ v /i)[1] }}</span>
      </div>

      <div class="flex justify-between items-center gap-2 text-[11px] py-1">
        <!-- Left: Market / Price -->
        <div class="flex flex-col flex-none w-[35%]">
          <span class="font-base">{{ b.market_name }}: </span>
          <span class="font-semibold">{{ b.price_name }}</span>
        </div>

        <!-- Middle: Competition -->
        <div class="flex-1 w-[60%] leading-tight">
          <span>Competition Name: {{ b.competition_name }}</span>
        </div>

        <!-- Right: Odd and Status -->
        <div
          class="flex items-center justify-end flex-none w-[25%] gap-1 font-bold text-[#486333] text-[12px]"
        >
          <span>{{ b.price_rate }}</span>
          <img
            v-if="b.result_status !== 2 && b.result_status !== 3"
            src="/icons/pending.svg"
            class="h-4 w-4"
            alt=""
          />
          <img
            v-if="b.result_status === 2"
            src="/icons/win.svg"
            class="h-4 w-4"
            alt=""
          />
          <img
            v-if="b.result_status === 3"
            src="/icons/lose.svg"
            class="h-4 w-4"
            alt=""
          />
        </div>
      </div>
    </div>
  </div>
</template>
