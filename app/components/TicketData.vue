<script setup>
import { computed, watch, ref } from "vue";
import StakeInput from "./StakeInput.vue";
import { t } from "@/composables/locales";

const ticket = useTicket();
const auth = useAuthStore();

const emit = defineEmits();

const demoWIthPoints = ref(false);

const props = defineProps({
  totalOdds: Number,
  possibleWin: Number,
  point: Number,
  placingBet: Boolean,
  placingBetError: Boolean,
  withPoints: Boolean,
  bBalance: Number,
});

function handleBetsClearing() {
  ticket.clearBets();
}
</script>

<template>
  <div class="bg-gray-200 px-4 py-3">
    <div class="flex justify-center items-center gap-2 mb-4">
      <StakeInput />
    </div>
    <div class="grid grid-cols-2 gap-1 my-2">
      <div class="bg-white flex justify-between rounded p-2 text-xs">
        <span>{{ t("TOTAL ODDS") }}</span>
        <span>{{ totalOdds }}</span>
      </div>
      <div class="bg-white flex justify-between rounded p-2 text-xs">
        <span>{{ t("Multi Bonus") }}</span>
        <span>{{ ((possibleWin * Number(point)) / 100).toFixed(2) }} ETB</span>
      </div>
      <div
        class="bg-white flex justify-between rounded p-2 text-xs"
        style="color: var(--ui-bg)"
      >
        <span>{{ t("Possible winning") }}</span>
        <span
          >{{
            (Number(possibleWin) + Number((possibleWin * point) / 100)).toFixed(
              2
            )
          }}
          ETB</span
        >
      </div>
      <div
        v-if="auth.bBalance >= 10"
        class="flex justify-center items-center gap-2"
      >
        <!-- <USwitch
          label="With points"
          v-model="demoWIthPoints"
          color="neutral"
          class="text-black"
          :ui="{
            base: 'text-black bg-default',
          }"
        /> -->
        <span class="text-xs">Bet with points</span>
        <div
          @click="$emit('toggleWithPoints')"
          class="w-10 h-5 bg-white rounded-full"
        >
          <div
            class="h-5 w-5 bg-default rounded-full transition-transform duration-300"
            :class="`${withPoints ? 'translate-x-5' : 'translate-x-0'}`"
          ></div>
        </div>
      </div>
    </div>

    <div
      v-if="placingBetError"
      class="text-red-500 font-bold flex justify-start gap-2 items-center my-2"
    >
      <Icon name="heroicons-exclamation-triangle" class="h-5 w-5" alt="" />
      <span>{{ placingBetError }}</span>
    </div>

    <div class="flex gap-1 text-sm">
      <Icon
        name="heroicons-trash"
        @click="handleBetsClearing"
        class="w-[10%] h-7 opacity-50"
      />
      <UButton
        :loading="placingBet"
        loading-icon="i-lucide-loader"
        @click="!placingBet && $emit('fastBet')"
        class="w-[40%] uppercase font-bold flex justify-center items-center bg-default !bg-default text-white"
      >
        {{ t("Place bet") }}
      </UButton>

      <UButton
        :loading="placingBet"
        loading-icon="i-lucide-loader"
        @click="!placingBet && $emit('placeBetsOnline')"
        class="w-[50%] uppercase font-bold flex justify-center items-center bg-default !bg-default text-white"
      >
        {{ t("Place bet online") }}
      </UButton>
    </div>
  </div>
</template>
