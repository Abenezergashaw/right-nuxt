<script setup>
import { computed } from "vue";
import { t } from "@/composables/locales";

const props = defineProps({
  gameDetail: Object,
  opendMarkets: Array,
  activeSelection: String,
  teams: String,
  eventId: String,
  ticketData: Array,
});

// Precompute selected ref IDs for O(1) lookup
const selectedRefs = computed(() => {
  return new Set(props.ticketData.map((t) => t.reference_id));
});

// helper
function isSelected(refId) {
  return selectedRefs.value.has(refId);
}

// emit handler
function emitSelection(p, m) {
  if (p.rate === 0) return;

  const payload = {
    amount: 1,
    errors: [],
    price_rate: p.rate,
    price_name: p.priceName,
    event_name: props.teams,
    isLive: false,
    market_name: m.marketName,
    price_hcap: p.handicapValue,
    reference_id: p.referenceId,
  };

  emit("betSelected", payload, props.eventId);
}

const emit = defineEmits(["openCloseMarket", "betSelected"]);
</script>

<template>
  <div class="bg-white pb-4 text-black">
    <div
      v-for="(m, index) in gameDetail.markets"
      :key="m.marketName"
      class="px-4 py-2 text-sm"
    >
      <!-- Market header -->
      <div
        class="flex justify-between py-1 border-b-[1.5px] text-xs"
        @click="$emit('openCloseMarket', index)"
      >
        <span class="font-semibold">{{ t(m.marketName) }}</span>

        <Icon
          name="heroicons:chevron-down"
          :class="[
            'text-lg text-black',
            opendMarkets.includes(index) ? ' rotate-180' : '',
          ]"
        />
      </div>

      <!-- Prices Grid -->
      <div
        v-if="opendMarkets.includes(index)"
        :class="
          m.orderColumnsCount === 3 && activeSelection !== 'Double Bets'
            ? 'grid grid-cols-3 gap-2 mt-2'
            : 'grid grid-cols-2 gap-2 mt-2'
        "
      >
        <div
          v-for="p in m.prices"
          :key="p.referenceId"
          class="flex justify-between items-center px-2 py-1 rounded-sm"
          :class="
            isSelected(p.referenceId)
              ? 'bg-primary text-white font-semibold'
              : 'bg-gray-200'
          "
          @click="emitSelection(p, m)"
        >
          <div>
            <span class="text-xs">
              {{ p.priceName }}
            </span>
            <span v-if="p.handicapValue" class="text-xs">
              [{{ p.handicapValue }}]
            </span>
          </div>

          <span class="text-xs">
            {{ p.rate === 0 ? "-" : p.rate }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
