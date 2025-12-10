<script setup>
import { computed } from "vue";
import { t } from "@/composables/locales";

const ticket = useTicket();
const general = useGeneral();
const ticketData = computed(() => ticket.ticket);
const stake = computed(() => general.stake);
const props = defineProps({
  tickets: Number,
  totalOdds: Number,
  point: Number,
  placingBet: Boolean,
  placingBetError: String,
  withPoints: Boolean,
});

const possibleWin = computed(() => {
  return ticketData.value.length
    ? (stake.value * props.totalOdds).toFixed(2)
    : 0;
});

const drawerOpen = ref(false);

const emit = defineEmits();

function handleFastBetting() {
  emit("fastBet");
  setTimeout(() => {
    drawerOpen.value = false;
  }, 500);
}

function handlePlaceBetsOnline() {
  emit("placeBetsOnline");
}
function handleToggleWithPoints() {
  emit("toggleWithPoints");
}
</script>

<template>
  <UDrawer
    v-model:open="drawerOpen"
    should-scale-background
    set-background-color-on-scale
    :handle="false"
  >
    <div
      class="flex justify-around items-center gap-6 text-sm py-3 tracking-wide relative cursor-pointer"
      @click="drawerOpen = true"
    >
      <div class="text-white flex gap-1 font-bold">
        <span>{{ tickets > 1 ? t("Ako") : t("Single") }}</span>
        <span>({{ tickets }})</span>
        <span class="text-amber-400">{{ totalOdds }}</span>
      </div>
      <div
        v-if="tickets > 1"
        class="text-white text-sm font-bold -translate-x-4"
      >
        <span>{{ t("Point") }}</span>
        <span class="text-amber-400"> {{ point }} % </span>
      </div>
      <Icon
        name="heroicons-chevron-up"
        class="absolute top-[8.5px] right-6 w-6 h-6 text-white"
      />
    </div>

    <!-- Drawer content -->
    <template #content
      ><div class="py-2 relative h-10 bg-default">
        <UButton
          icon="i-lucide-chevron-down"
          color="neutral"
          variant="ghost"
          size="xl"
          class="absolute top-0 right-2"
          @click="drawerOpen = false"
        />
      </div>
      <div class="flex flex-col h-screen relative bg-gray-200 overflow-y-auto">
        <main class="flex-1 h-dvh">
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
            :point="point"
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
    </template>
  </UDrawer>
</template>
