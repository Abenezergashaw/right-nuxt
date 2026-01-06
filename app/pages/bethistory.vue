<script setup>
import axios from "axios";
import { isTemplateExpression } from "typescript";

definePageMeta({
  layout: "secondary",
});

const url = useUrl().url;
const router = useRouter();
const betHistoryData = ref([]);
const auth = useAuthStore();

const betTimeFilter = ref("24 hours");
const betSportFilter = ref("Sports");
const users = ref([]);

const showCreateUserModal = ref(false);
const userModal = ref(false);
const userBalanceModal = ref(false);
const userPhone = ref(null);
const userId = ref(null);
const userBalance = ref(50);
const userTransaction = ref("Deposit");

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

function getWinAmount(item) {
  return item.stake * item.totalOdds > 1000
    ? (item.stake * item.totalOdds * 0.85).toFixed(2)
    : (item.stake * item.totalOdds).toFixed(2);
}

async function markTicketAsPaid(ticket) {
  const res = await axios.get(`${url}/api/markAsPaid?ticket=${ticket}`, {
    withCredentials: true,
  });

  if (!res.data.error) {
    await goToBetHistory();
    alert("Ticket has been marked as paid.");
  }
}

const totalData = computed(() => {
  if (!betHistoryData.value.length) {
    return { totalStake: 0, wonAmount: 0, paidAmount: 0 };
  }

  const totalStake = betHistoryData.value.reduce((acc, bet) => {
    return acc + Number(bet.stake || 0);
  }, 0);

  const wonTickets = betHistoryData.value.filter((bet) => bet.status === 1);

  const wonAmount = wonTickets.reduce((acc, bet) => {
    return acc + Number(bet.stake) * Number(bet.totalOdds);
  }, 0);

  const paidTickets = betHistoryData.value.filter(
    (bet) => bet.status === 1 && bet.paid === 1
  );

  const paidAmount = paidTickets.reduce((acc, bet) => {
    return acc + Number(bet.stake) * Number(bet.totalOdds);
  }, 0);

  return { totalStake, wonAmount, paidAmount };
});

async function handleCreateUser(data) {
  const userId = auth.user.id;

  const res = await axios.post(
    `${url}/api/createUser`,
    {
      phone: data.phone,
      password: data.password,
      userId,
    },
    {
      withCredentials: true,
    }
  );

  alert(res.data.message);
}

async function fetchUsers() {
  const userId = auth.user.id;
  const res = await axios.get(`${url}/api/fetchUsers?id=${userId}`, {
    withCredentials: true,
  });

  if (!res.data.error) {
    users.value = res.data;
  }

  userModal.value = true;
}

function handleCreateTransaction(type, user, phone) {
  userModal.value = false;
  userBalanceModal.value = true;
  userPhone.value = phone;
  userId.value = user;
  userTransaction.value = type;
}

async function submitAmount() {
  const adminId = auth.user.id;

  const res = await axios.post(
    `${url}/api/manageBalanceByAdmin`,
    {
      adminId,
      userId: userId.value,
      type: userTransaction.value,
      amount: userBalance.value,
    },
    {
      withCredentials: true,
    }
  );

  alert(res.data.message);
  userBalanceModal.value = false;
  const ok = await auth.checkSession();
}

onMounted(async () => {
  await goToBetHistory();
});
</script>

<template>
  <div
    class="relative h-screen overflow-y-auto w-full md:w-[52%] md:min-w-[600px] px-4 mx-auto mt-2 rounded-t-md"
  >
    <div class="my-1 bg-white rounded-md py-2 px-4 hidden md:flex gap-2">
      <button
        @click="showCreateUserModal = true"
        class="bg-default cursor-pointer px-4 py-1 rounded-md hover:opacity-80"
      >
        Create user
      </button>
      <button
        @click="fetchUsers"
        class="bg-amber-300 cursor-pointer px-4 py-1 rounded-md hover:opacity-80"
      >
        Users
      </button>
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

    <div
      class="w-full my-2 bg-gray-200 rounded-md hidden md:flex justify-between px-4"
    >
      <div class="bg-default rounded-md px-2 py-1">
        Bet: {{ totalData.totalStake.toFixed(2) }} ETB
      </div>
      <div class="bg-amber-300 rounded-md px-2 py-1">
        Won: {{ totalData.wonAmount.toFixed(2) }} ETB
      </div>
      <div class="bg-purple-400 rounded-md px-2 py-1">
        Paid: {{ totalData.paidAmount.toFixed(2) }} ETB
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
        {{ item.status === 1 ? getWinAmount(item) : "" }}
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

      <div
        v-if="item.status === 1"
        class="gap-2 justify-start my-2 hidden md:flex"
      >
        <div
          @click.stop="markTicketAsPaid(item.ticketId)"
          v-if="item.paid === 0"
          class="py-1 px-4 rounded-md text-sm bg-default text-white cursor-pointer hover:opacity-75"
        >
          Mark Paid
        </div>

        <div v-else class="py-1 px-4 rounded-md text-sm bg-amber-300">Paid</div>
      </div>
    </div>
  </div>

  <CreateUser
    :open="showCreateUserModal"
    @close="showCreateUserModal = false"
    @save="handleCreateUser"
  />

  <UModal
    v-model:open="userModal"
    title="Users"
    :ui="{ footer: 'justify-end' }"
  >
    <UButton color="neutral" variant="subtle" label="Open" />

    <template #body>
      <div class="space-y-2">
        <div
          v-for="user in users"
          :key="user.id"
          class="flex items-center justify-between bg-[#eaeaea] rounded-md px-3 py-2"
        >
          <!-- USER INFO -->
          <div class="flex flex-col">
            <span class="text-sm font-semibold text-black">
              {{ user.phone }}
            </span>
            <span class="text-xs text-gray-600"> ID: {{ user.id }} </span>
          </div>

          <!-- BALANCE -->
          <div class="text-right">
            <div class="text-sm font-bold text-black">
              {{ (user.rBalance + user.bBalance).toFixed(2) }}
            </div>
            <div class="text-xs text-gray-600">Balance</div>
          </div>

          <!-- ACTIONS -->
          <div class="flex gap-2">
            <button
              @click="handleCreateTransaction('Deposit', user.id, user.phone)"
              class="px-3 py-1 text-xs rounded bg-green-600 text-white hover:opacity-80"
            >
              Deposit
            </button>

            <button
              @click="handleCreateTransaction('Withdraw', user.id, user.phone)"
              class="px-3 py-1 text-xs rounded bg-red-600 text-white hover:opacity-80"
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <UButton
        label="Close"
        color="neutral"
        variant="outline"
        @click="userModal = false"
      />
    </template>
  </UModal>

  <div
    v-if="userBalanceModal"
    class="fixed inset-0 flex items-center justify-center bg-opacity-40 z-50"
  >
    <div class="bg-black rounded-md p-4 w-64">
      <h3 class="text-sm font-semibold mb-3">{{ userTransaction }}</h3>

      <h6 class="text-sm font-semibold mb-3">{{ userPhone }}</h6>

      <input
        v-model.number="userBalance"
        type="number"
        min="0"
        placeholder="Amount"
        class="w-full border rounded px-2 py-1 mb-3 text-sm"
      />

      <button
        @click="submitAmount"
        class="w-full cursor-pointer py-1 text-sm bg-green-600 text-white rounded"
      >
        {{ userTransaction }}
      </button>
      <button
        @click="userBalanceModal = false"
        class="w-full cursor-pointer py-1 text-sm mt-2 bg-red-600 text-white rounded"
      >
        Close
      </button>
    </div>
  </div>
</template>
