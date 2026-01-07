<script setup>
definePageMeta({
  layout: "secondary",
});
import { t } from "@/composables/locales";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const url = useUrl().url;

const phoneNumber = ref(auth.user?.phone);
const amount = ref(100);

const showTelebirrDeposit = ref(false);
const showCbebirrDeposit = ref(false);
const depositMethod = ref("telebirr");

const showTelebirrWithdraw = ref(false);
const showCbebirrWithdraw = ref(false);
const withdrawMethod = ref("telebirr");
const withdrawAmount = ref("");
const withdrawPhone = ref(auth.user?.phone);
const successfulCbebirrWithdrawal = ref(false);
const successfulTelebirrWithdrawal = ref(false);
const withdrawTransactionId = ref(null);

const depositLoader = ref(false);
const withdrawLoader = ref(false);

const showManualTelebirrDeposit = ref(false);
const maualDepositPhone = ref(auth.user?.phone);
const manualDepositLoader = ref(false);
const manualDepositReference = ref("");
const manualInformationStatus = ref(false);

const showManualTelebirrWithdraw = ref(false);

// tabs config
const tabs = [
  { label: "Deposit", key: "deposit" },
  { label: "Withdraw", key: "withdraw" },
  { label: "History", key: "history" },
];

// active tab based on route
const active = computed(() => route.params.method);
const setActive = (key) => {
  router.push(`/payment/${key}`);
};

async function handleDeposit(method, e) {
  e.preventDefault();

  // basic trimming
  const phone = phoneNumber.value.trim();
  const amt = Number(amount.value);

  // validate phone: only digits
  if (!/^\d+$/.test(phone)) {
    alert("Phone number must contain digits only.");
    return;
  }

  // validate phone length and starting digit
  if (phone.length !== 9 || !/^[79]/.test(phone)) {
    alert("Phone number must be 9 digits and start with 7 or 9.");
    return;
  }

  // validate amount
  if (isNaN(amt) || amt < 10) {
    alert("Minimum deposit amount is 10 ETB.");
    return;
  }

  try {
    const res = await axios.post(
      `${url}/api/deposit`,
      {
        phone,
        amount: amt,
        method: 2,
      },
      {
        withCredentials: true,
      }
    );

    console.log("Deposit success", res.data);
    if (res.data.status) {
      setTimeout(async () => {
        await auth.checkSession();
      }, 4000);
    }
  } catch (err) {
    alert("Something went wrong while processing your deposit.");
    console.error(err);
  }
}

async function handleWithdraw(method, e) {
  e.preventDefault();

  const res = await axios.post(
    `${url}/api/withdraw`,
    {
      amount: withdrawAmount.value,
      method: method,
    },
    {
      withCredentials: true,
    }
  );

  if (res.data.error) {
    alert(res.data.message);
    return;
  }
  if (method === 1) {
    successfulTelebirrWithdrawal.value = true;
  } else {
    successfulCbebirrWithdrawal.value = true;
  }
  withdrawTransactionId.value = res.data.txn_id;
  auth.checkSession();
  setTimeout(() => {
    if (method === 1) {
      successfulTelebirrWithdrawal.value = false;
    } else {
      successfulCbebirrWithdrawal.value = false;
    }
  }, 10000);
}

async function handleManualDeposit(e) {
  e.preventDefault();
  try {
    manualDepositLoader.value = true;
    const res = await axios.post(
      `${url}/api/manualDeposit`,
      {
        reference: manualDepositReference.value,
        phone: maualDepositPhone.value,
      },
      {
        withCredentials: true,
      }
    );

    if (!res.data.error) {
      manualDepositLoader.value = false;
      alert(res.data.message);
      const ok = auth.checkSession();
    } else {
      manualDepositLoader.value = false;
      alert(res.data.message);
    }
  } catch (error) {
    manualDepositLoader.value = false;
    console.log("Manual deposit failed: ", error);
  }
}

const loadingHistory = ref(true);

onMounted(() => {
  if (active.value === "history") {
    setTimeout(() => {
      loadingHistory.value = false;
    }, 5000);
  }
});
</script>

<template>
  <div class="h-screen overflow-y-auto w-full md:w-[52%] mx-auto">
    <!-- Header -->
    <div
      class="h-14 bg-default px-6 uppercase text-lg tracking-wider flex items-center"
    >
      {{ active }}
    </div>

    <div class="border-b border-gray-300 w-[80%] mx-auto" />

    <!-- Tab Buttons -->
    <div
      class="flex gap-6 px-6 py-3 bg-default uppercase font-medium text-sm tracking-wide justify-center"
    >
      <button
        v-for="t in tabs"
        :key="t.key"
        @click="setActive(t.key)"
        class="pb-2"
        :class="[
          'cursor-pointer',
          active === t.key
            ? 'border-b-4 border-primary text-primary'
            : 'text-white',
        ]"
      >
        {{ t.label }}
      </button>
    </div>

    <!-- Panels -->
    <div class="px-2 mt-2">
      <div v-if="active === 'deposit'" class="flex flex-col gap-2">
        <div>
          <div
            @click="
              showTelebirrDeposit = !showTelebirrDeposit;
              depositMethod = 'telebirr';
            "
            class="bg-white flex justify-between items-center p-2 text-black"
          >
            <img src="/icons/teleBirr.svg" class="h-8 w-24" alt="" />
            <Icon
              :name="
                showTelebirrDeposit
                  ? 'heroicons-chevron-up'
                  : 'heroicons-chevron-down'
              "
            />
          </div>

          <div
            v-if="showTelebirrDeposit"
            class="relative bg-white flex flex-col justify-between items-center p-2 text-black"
          >
            <form
              class="space-y-4 mt-0 pb-4"
              @submit="handleDeposit(1, $event)"
            >
              <div class="text-xs">{{ t("Phone number") }}</div>

              <div>
                <UInput
                  label="Phone Number"
                  type="tel"
                  placeholder="+251"
                  class="w-[20%] bg-white rounded-none"
                  size="xl"
                  disabled
                  :ui="{
                    base: 'bg-white rounded-none',
                  }"
                />
                <UInput
                  label="Phone Number"
                  type="tel"
                  v-model="phoneNumber"
                  :placeholder="t('Phone number')"
                  class="w-[80%] bg-white rounded-none text-black"
                  size="xl"
                  :ui="{
                    base: 'bg-white rounded-none text-black',
                  }"
                />
              </div>

              <div class="text-xs">{{ t("Amount") }}</div>

              <UInput
                label="Amount"
                type="number"
                v-model="amount"
                :placeholder="t('Amount')"
                class="w-full bg-white rounded-none"
                size="xl"
                :ui="{
                  base: 'bg-white rounded-none text-black',
                }"
              />

              <UButton
                type="submit"
                color="primary"
                block
                :loading="depositLoader"
                loading-icon="i-lucide-loader"
                class="mt-1 text-center uppercase"
                size="xl"
              >
                {{ t(active) }}
              </UButton>
            </form>
          </div>
        </div>

        <div>
          <div
            @click="
              showCbebirrDeposit = !showCbebirrDeposit;
              depositMethod = 'cbebirr';
            "
            class="bg-white flex justify-between items-center p-2 text-black"
          >
            <img src="/icons/cbeBirr.svg" class="h-8 w-24" alt="" />
            <Icon
              :name="
                showCbebirrDeposit
                  ? 'heroicons-chevron-up'
                  : 'heroicons-chevron-down'
              "
            />
          </div>
          <div
            v-if="showCbebirrDeposit"
            class="relative bg-white flex flex-col justify-between items-center p-2 text-black"
          >
            <form
              class="space-y-4 mt-0 pb-4"
              @submit="handleDeposit(2, $event)"
            >
              <div class="text-xs">{{ t("Phone number") }}</div>

              <div>
                <UInput
                  label="Phone Number"
                  type="tel"
                  placeholder="+251"
                  class="w-[20%] bg-white rounded-none"
                  size="xl"
                  disabled
                  :ui="{
                    base: 'bg-white rounded-none',
                  }"
                />
                <UInput
                  label="Phone Number"
                  type="tel"
                  v-model="phoneNumber"
                  :placeholder="t('Phone number')"
                  class="w-[80%] bg-white rounded-none text-black"
                  size="xl"
                  :ui="{
                    base: 'bg-white rounded-none text-black',
                  }"
                />
              </div>

              <div class="text-xs">{{ t("Amount") }}</div>

              <UInput
                label="Amount"
                type="number"
                v-model="amount"
                :placeholder="t('Amount')"
                class="w-full bg-white rounded-none"
                size="xl"
                :ui="{
                  base: 'bg-white rounded-none text-black',
                }"
              />

              <UButton
                type="submit"
                color="primary"
                block
                :loading="depositLoader"
                loading-icon="i-lucide-loader"
                class="mt-1 text-center uppercase"
                size="xl"
              >
                {{ t(active) }}
              </UButton>
            </form>
          </div>
        </div>

        <!-- Manual telebirr deposit  -->
        <div
          @click="manualInformationStatus = !manualInformationStatus"
          class="py-4 px-2 text-center text-black flex items-center gap-2 justify-center"
        >
          Manual Deposit
          <Icon
            :name="
              manualInformationStatus
                ? 'heroicons-chevron-up'
                : 'heroicons-chevron-down'
            "
          />
        </div>

        <div
          v-if="manualInformationStatus"
          class="flex flex-col text-black justify-center px-2 items-center"
        >
          <p>1. መጀመሪያ ወደ 0956457051 ቴሌብር ያስትላልፉ።</p>
          <p>
            2. የላካችሁበትን ስልክ ቁጥር እና ከቴሌብር ከተላከላችሁ ሜሴጅ ላይ
            <strong>‹ transaction number ›</strong> ሚለውን አስገብተው
            <strong> Deposit </strong> ሚለውን ይጫኑ።
          </p>
        </div>

        <div>
          <div
            @click="
              showManualTelebirrDeposit = !showManualTelebirrDeposit;
              depositMethod = 'telebirr';
            "
            class="bg-white flex justify-between items-center p-2 text-black"
          >
            <img src="/icons/teleBirr.svg" class="h-8 w-24" alt="" />
            <Icon
              :name="
                showManualTelebirrDeposit
                  ? 'heroicons-chevron-up'
                  : 'heroicons-chevron-down'
              "
            />
          </div>

          <div
            v-if="showManualTelebirrDeposit"
            class="relative bg-white flex flex-col justify-between items-center p-2 text-black"
          >
            <form
              class="space-y-4 mt-0 pb-4"
              @submit="handleManualDeposit($event)"
            >
              <div class="text-xs">{{ t("Phone number") }}</div>

              <div>
                <UInput
                  label="Phone Number"
                  type="tel"
                  placeholder="+251"
                  class="w-[20%] bg-white rounded-none"
                  size="xl"
                  disabled
                  :ui="{
                    base: 'bg-white rounded-none',
                  }"
                />
                <UInput
                  label="Phone Number"
                  type="tel"
                  v-model="maualDepositPhone"
                  :placeholder="t('Phone number')"
                  class="w-[80%] bg-white rounded-none text-black"
                  size="xl"
                  :ui="{
                    base: 'bg-white rounded-none text-black',
                  }"
                />
              </div>

              <div class="text-xs">{{ t("Reference Code") }}</div>

              <UInput
                label="Reference Code"
                type="text"
                v-model="manualDepositReference"
                placeholder="Reference Code"
                class="w-full bg-white rounded-none"
                size="xl"
                :ui="{
                  base: 'bg-white rounded-none text-black',
                }"
              />

              <UButton
                type="submit"
                color="primary"
                block
                :loading="manualDepositLoader"
                loading-icon="i-lucide-loader"
                class="mt-1 text-center uppercase"
                size="xl"
              >
                {{ t(active) }}
              </UButton>
            </form>
          </div>
        </div>
      </div>

      <div v-else-if="active === 'withdraw'" class="flex flex-col gap-2">
        <div>
          <div
            @click="
              showTelebirrWithdraw = !showTelebirrWithdraw;
              withdrawMethod = 'telebirr';
            "
            class="bg-white flex justify-between items-center p-2 text-black"
          >
            <img src="/icons/teleBirr.svg" class="h-8 w-24" alt="" />
            <Icon
              :name="
                showTelebirrWithdraw
                  ? 'heroicons-chevron-up'
                  : 'heroicons-chevron-down'
              "
            />
          </div>

          <div
            v-if="showTelebirrWithdraw && !successfulTelebirrWithdrawal"
            class="relative bg-white flex flex-col justify-between items-center p-2 text-black"
          >
            <div
              class="text-[11px] block right-1 justify-end text-end text-[#486333] opacity-75 w-full"
            >
              Your Accessible Withdraw Amount (AWA) is {{ auth.rBalance }} ETB
            </div>
            <form
              class="space-y-4 mt-0 pb-4"
              @submit="handleWithdraw(1, $event)"
            >
              <div class="text-xs">{{ t("Phone number") }}</div>

              <div>
                <UInput
                  label="Phone Number"
                  type="tel"
                  placeholder="+251"
                  class="w-[20%] bg-white rounded-none"
                  size="xl"
                  disabled
                  :ui="{
                    base: 'bg-white rounded-none',
                  }"
                />
                <UInput
                  label="Phone Number"
                  type="tel"
                  v-model="withdrawPhone"
                  disabled=""
                  :placeholder="t('Phone number')"
                  class="w-[80%] bg-white rounded-none text-black"
                  size="xl"
                  :ui="{
                    base: 'bg-white rounded-none text-black',
                  }"
                />
              </div>

              <div class="text-xs">{{ t("Amount") }}</div>

              <UInput
                label="Amount"
                type="number"
                v-model="withdrawAmount"
                :placeholder="t('Amount')"
                class="w-full bg-white rounded-none"
                size="xl"
                :ui="{
                  base: 'bg-white rounded-none text-black',
                }"
              />

              <UButton
                type="submit"
                color="primary"
                block
                :loading="withdrawLoader"
                loading-icon="i-lucide-loader"
                class="mt-1 text-center uppercase"
                size="xl"
              >
                {{ t(active) }}
              </UButton>
            </form>
          </div>

          <div
            v-if="false"
            class="text-black pb-4 flex flex-col gap-1 mt-0 px-4 bg-white"
          >
            <span class="font-bold text-sm"
              >We will transfer {{ withdrawAmount }} ETB to your wallet as
              :</span
            >
            <span class="font-bold text-sm">1x{{ withdrawAmount }} ETB </span
            ><span class="font-bold text-sm"
              >Total: {{ withdrawAmount }} ETB
            </span>
            <span class="text-xs font-light">Order Accepted</span>
            <span class="text-xs font-light"
              >Our managers will review your order soon.</span
            >
            <span class="text-xs font-light"
              >You can track the status of your order with a transaction code:
              {{ withdrawTransactionId }}.</span
            >
          </div>
        </div>

        <div>
          <div
            @click="
              showCbebirrWithdraw = !showCbebirrWithdraw;
              withdrawMethod = 'telebirr';
            "
            class="bg-white flex justify-between items-center p-2 text-black"
          >
            <img src="/icons/cbeBirr.svg" class="h-8 w-24" alt="" />
            <Icon
              :name="
                showCbebirrWithdraw
                  ? 'heroicons-chevron-up'
                  : 'heroicons-chevron-down'
              "
            />
          </div>

          <div
            v-if="showCbebirrWithdraw && !successfulCbebirrWithdrawal"
            class="relative bg-white flex flex-col justify-between items-center p-2 text-black"
          >
            <div
              class="text-[11px] block right-1 justify-end text-end text-[#486333] opacity-75 w-full"
            >
              Your Accessible Withdraw Amount (AWA) is {{ auth.rBalance }} ETB
            </div>
            <form
              class="space-y-4 mt-0 pb-4"
              @submit="handleWithdraw(2, $event)"
            >
              <div class="text-xs">{{ t("Phone number") }}</div>

              <div>
                <UInput
                  label="Phone Number"
                  type="tel"
                  placeholder="+251"
                  class="w-[20%] bg-white rounded-none"
                  size="xl"
                  disabled
                  :ui="{
                    base: 'bg-white rounded-none',
                  }"
                />
                <UInput
                  label="Phone Number"
                  type="tel"
                  v-model="withdrawPhone"
                  disabled=""
                  :placeholder="t('Phone number')"
                  class="w-[80%] bg-white rounded-none text-black"
                  size="xl"
                  :ui="{
                    base: 'bg-white rounded-none text-black',
                  }"
                />
              </div>

              <div class="text-xs">{{ t("Amount") }}</div>

              <UInput
                label="Amount"
                type="number"
                v-model="withdrawAmount"
                :placeholder="t('Amount')"
                class="w-full bg-white rounded-none"
                size="xl"
                :ui="{
                  base: 'bg-white rounded-none text-black',
                }"
              />

              <UButton
                type="submit"
                color="primary"
                block
                :loading="withdrawLoader"
                loading-icon="i-lucide-loader"
                class="mt-1 text-center uppercase"
                size="xl"
              >
                {{ t(active) }}
              </UButton>
            </form>
          </div>

          <div
            v-if="successfulCbebirrWithdrawal"
            class="text-black pb-4 flex flex-col gap-1 mt-0 px-4 bg-white"
          >
            <span class="font-bold text-sm"
              >We will transfer {{ withdrawAmount }} ETB to your wallet as
              :</span
            >
            <span class="font-bold text-sm">1x{{ withdrawAmount }} ETB </span
            ><span class="font-bold text-sm"
              >Total: {{ withdrawAmount }} ETB
            </span>
            <span class="text-xs font-light">Order Accepted</span>
            <span class="text-xs font-light"
              >Our managers will review your order soon.</span
            >
            <span class="text-xs font-light"
              >You can track the status of your order with a transaction code:
              {{ withdrawTransactionId }}.</span
            >
          </div>
        </div>

        <!-- Manual telebirr withdraw  -->
        <div
          class="py-4 px-2 text-center text-black flex items-center gap-2 justify-center"
        >
          Manual WIthdraw
        </div>

        <div>
          <div
            @click="
              showManualTelebirrWithdraw = !showManualTelebirrWithdraw;
              withdrawMethod = 'telebirr';
            "
            class="bg-white flex justify-between items-center p-2 text-black"
          >
            <img src="/icons/teleBirr.svg" class="h-8 w-24" alt="" />
            <Icon
              :name="
                showManualTelebirrWithdraw
                  ? 'heroicons-chevron-up'
                  : 'heroicons-chevron-down'
              "
            />
          </div>

          <div
            v-if="showManualTelebirrWithdraw && !successfulTelebirrWithdrawal"
            class="relative bg-white flex flex-col justify-between items-center p-2 text-black"
          >
            <div
              class="text-[11px] block right-1 justify-end text-end text-[#486333] opacity-75 w-full"
            >
              Your Accessible Withdraw Amount (AWA) is {{ auth.rBalance }} ETB
            </div>
            <form
              class="space-y-4 mt-0 pb-4"
              @submit="handleWithdraw(1, $event)"
            >
              <div class="text-xs">{{ t("Phone number") }}</div>

              <div>
                <UInput
                  label="Phone Number"
                  type="tel"
                  placeholder="+251"
                  class="w-[20%] bg-white rounded-none"
                  size="xl"
                  disabled
                  :ui="{
                    base: 'bg-white rounded-none',
                  }"
                />
                <UInput
                  label="Phone Number"
                  type="tel"
                  v-model="withdrawPhone"
                  disabled=""
                  :placeholder="t('Phone number')"
                  class="w-[80%] bg-white rounded-none text-black"
                  size="xl"
                  :ui="{
                    base: 'bg-white rounded-none text-black',
                  }"
                />
              </div>

              <div class="text-xs">{{ t("Amount") }}</div>

              <UInput
                label="Amount"
                type="number"
                v-model="withdrawAmount"
                :placeholder="t('Amount')"
                class="w-full bg-white rounded-none"
                size="xl"
                :ui="{
                  base: 'bg-white rounded-none text-black',
                }"
              />

              <UButton
                type="submit"
                color="primary"
                block
                :loading="withdrawLoader"
                loading-icon="i-lucide-loader"
                class="mt-1 text-center uppercase"
                size="xl"
              >
                {{ t(active) }}
              </UButton>
            </form>
          </div>

          <div
            v-if="successfulTelebirrWithdrawal"
            class="text-black pb-4 flex flex-col gap-1 mt-0 px-4 bg-white"
          >
            <span class="font-bold text-sm"
              >We will transfer {{ withdrawAmount }} ETB to your wallet as
              :</span
            >
            <span class="font-bold text-sm">1x{{ withdrawAmount }} ETB </span
            ><span class="font-bold text-sm"
              >Total: {{ withdrawAmount }} ETB
            </span>
            <span class="text-xs font-light">Order Accepted</span>
            <span class="text-xs font-light"
              >Our managers will review your order soon.</span
            >
            <span class="text-xs font-light"
              >You can track the status of your order with a transaction code:
              {{ withdrawTransactionId }}.</span
            >
          </div>
        </div>
      </div>

      <div v-else-if="active === 'history'">
        <div
          class="flex flex-col items-center justify-center py-10 text-[#486333]"
          v-if="loadingHistory"
        >
          <div
            class="animate-spin rounded-full h-10 w-10 border-4 border-[#486333] border-t-transparent mb-4"
          ></div>
          <div class="text-sm tracking-wide opacity-80">Loading history...</div>
        </div>

        <div
          v-else
          class="flex flex-col items-center justify-center py-10 text-black"
        >
          <div class="text-red-400 font-semibold text-lg">
            Could not load data
          </div>
          <div class="opacity-70 text-sm mt-1">Please try again.</div>
        </div>
      </div>

      <div v-else>Invalid Tab</div>
    </div>
  </div>
</template>
