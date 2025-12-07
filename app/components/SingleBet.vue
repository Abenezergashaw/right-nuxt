<script setup>
import { t } from "@/composables/locales";

const ticket = useTicket();

defineProps({
  tickets: Array,
});
function removeBet(index) {
  ticket.removeBet(index);
}
</script>
<template>
  <div v-for="(tt, index) in tickets" class="p-0.5 flex">
    <div class="rounded px-2 py-1 flex-1" style="background-color: #fff">
      <span class="font-bold uppercase text-xs text-black">{{
        t(tt.event_name)
      }}</span>
      <div
        class="flex justify-start items-center gap-2 text-red-500 font-bold text-[13px]"
        v-if="tt.errors.length > 0"
      >
        <Icon name="heroicons-exclamation-triangle" class="h-4 w-4" alt="" />
        <span class="">{{ t(tt.errors[0].message) }}</span>
      </div>
      <div class="flex justify-between text-[11px] font-semibold text-black">
        <span>{{ t(tt.market_name) }}: {{ t(tt.price_name) }}</span>

        <span class="" style="color: var(--ui-bg)">{{ tt.price_rate }}</span>
      </div>
    </div>
    <div
      class="w-6 bg-default text-white flex justify-center items-center rounded-r"
      @click="removeBet(index)"
    >
      <Icon name="heroicons-x-mark" class="w-4 h-4 text-white" />
    </div>
  </div>
</template>
