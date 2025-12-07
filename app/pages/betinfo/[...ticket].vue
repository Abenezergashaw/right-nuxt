<script setup>
import axios from "axios";

definePageMeta({
  layout: "secondary",
});

const url = useUrl().url;
const route = useRoute();
const router = useRouter();

const checkTicketData = ref(null);
const checkTicketError = ref(null);
const checkTicketId = ref(route.params.ticket[0]);

async function handleCheckTicket() {
  checkTicketData.value = null;
  checkTicketError.value = null;
  if (checkTicketId.value !== null) {
    const res = await axios.post(`${url}/api/checkTicket`, {
      id: checkTicketId.value,
    });
    if (res.data[0].error) {
      checkTicketError.value = res.data[0].message;
      return;
    }
    checkTicketData.value = res.data[0].data;
    console.log(checkTicketData.value);
  }
}

function checkTicket() {
  router.push(`/betinfo/${checkTicketId.value}`);
}

onMounted(async () => {
  await handleCheckTicket();
});
</script>

<template>
  <div class="h-screen overflow-y-auto">
    <div class="py-3 px-2 uppercase font-semibold bg-default text-white">
      bet details
    </div>
    <div class="bg-[#ededed] pt-3 pb-1 px-2 border-0">
      <span class="text-xs font-semibold text-black">Ticket Number</span>
      <div class="py-2 flex gap-1.5">
        <input
          type="text"
          v-model="checkTicketId"
          class="py-3 px-2 border text-black border-gray-700 text-xs flex-1 outline-orange-500"
        />
        <button
          @click="checkTicket"
          class="uppercase text-white font-bold bg-default py-3 text-xs px-3 rounded"
        >
          check
        </button>
      </div>
      <div class="text-xs font-light text-red-500 text-center mb-2">
        {{ checkTicketError }}
      </div>
    </div>
    <CheckTicketData
      v-if="checkTicketData"
      :checkTicketData="checkTicketData ? checkTicketData : {}"
    />
  </div>
</template>
