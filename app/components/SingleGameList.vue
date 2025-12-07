<script setup>
import { computed } from "vue";
import { useCountryFlag } from "@/composables/useFlags";
import { t } from "@/composables/locales";

const { getFlag } = useCountryFlag();

const props = defineProps({
  game: Object,
  ticketData: Array,
});

// format date
const formattedDate = computed(() => {
  const date = new Date(props.game.events[0].eventStartTime);
  const opts = {
    timeZone: "Africa/Addis_Ababa",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  return new Intl.DateTimeFormat("en-GB", opts).format(date).replace(",", "");
});

// extract frequently accessed data once
const event = computed(() => props.game?.events?.[0] ?? {});
const market = computed(
  () => event.value?.collections?.[0]?.markets?.[0] ?? {}
);
const prices = computed(() => market.value?.prices ?? []);

// build fast lookup set
const ticketSet = computed(
  () => new Set(props.ticketData.map((t) => t.reference_id))
);

function selectBet(price) {
  if (!price.rate) return;

  const data = {
    amount: 1,
    errors: [],
    price_rate: price.rate,
    price_name: price.priceName,
    event_name: event.value.eventName,
    isLive: false,
    market_name: market.value.marketName,
    price_hcap: price.handicapValue,
    reference_id: price.referenceId,
  };

  emit("betSelected", data, "0");
}

const emit = defineEmits(["betSelected", "goIntoGameDetails"]);
</script>

<template>
  <div class="w-full p-2 border-b-2 border-gray-500 bg-gray-200">
    <!-- Header -->
    <RouterLink
      :to="`/sport/events/${game.sportName}/${game.sportId}/${game.country}/${game.competitionName}/${game.events[0].eventName}_id${game.events[0].eventId}`"
      class="flex justify-between"
    >
      <div class="flex gap-1 items-center">
        <img :src="`/flags/${getFlag(game.country)}`" class="w-[18px] h-3" />
        <span class="text-[11px] text-black"
          >{{ t(game.country) }} - {{ t(game.competitionName) }}</span
        >
      </div>

      <div class="text-[11px] text-black">{{ formattedDate }}</div>
    </RouterLink>

    <!-- Event name -->
    <RouterLink
      :to="`/sport/events/${game.sportName}/${game.sportId}/${game.country}/${game.competitionName}/${game.events[0].eventName}_id${game.events[0].eventId}`"
      class="flex justify-between items-center mt-0.5"
    >
      <span class="font-semibold tracking-wide uppercase text-xs text-black">
        {{ event.eventName }}
      </span>

      <div class="box text-[10px] px-1 font-semibold -translate-x-2">
        +{{ event.pricesCount }}
        <div class="triangle"></div>
      </div>
    </RouterLink>

    <!-- Dynamic price buttons -->
    <div class="flex gap-1 text-[10px] mt-0.5">
      <div
        v-for="(price, i) in prices"
        :key="price.referenceId"
        class="flex-1 flex justify-between px-2 py-1 rounded-sm"
        :style="{
          backgroundColor: ticketSet.has(price.referenceId)
            ? '#42BC86'
            : 'white',
        }"
        @click="selectBet(price)"
      >
        <span
          class="opacity-85"
          :class="
            ticketSet.has(price.referenceId)
              ? 'text-white font-semibold text-[11px]'
              : 'text-[#666] text-[11px]'
          "
        >
          {{ ["1", "X", "2"][i] }}
        </span>

        <span
          :class="
            ticketSet.has(price.referenceId)
              ? 'text-[#486333] font-semibold text-[12px]'
              : 'text-[#486333] text-[12px]'
          "
        >
          {{ price.rate === 0 ? "-" : price.rate }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.box {
  position: relative;
  background-color: #42bc86;
  color: black;
}

.triangle {
  position: absolute;
  top: 50%;
  right: -8px;
  transform: translateY(-50%);
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-left: 8px solid #42bc86;
}
</style>
