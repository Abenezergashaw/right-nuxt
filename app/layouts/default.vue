<script setup>
import { ref, computed, onMounted } from "vue";
import { t } from "@/composables/locales";

const auth = useAuthStore();
const router = useRouter();
const isLoggedIn = computed(() => auth.loggedIn);

// drawers / modals
const sidebarOpen = ref(false);
const rightSidebarOpen = ref(false);
const showBalanceModal = ref(false);

// submenu toggles
const showSportsSubmenu = ref(false);
const showMyBets = ref(true);
const showBalanceOptions = ref(true);

// reusable menu arrays
const sportsSubmenu = [
  { label: "Top", to: "/home/top" },
  { label: "Upcoming", to: "/home/upcoming" },
  { label: "Sport", to: "/sport/events/countries" },
];

const menuItems = [
  { label: "Live", icon: "i-heroicons-video-camera", to: "/" },
  { label: "Games", icon: "i-heroicons-puzzle-piece", to: "/casino" },
  { label: "Live Games", icon: "i-heroicons-bolt", to: "/casino" },
  {
    label: "Virtual Sport",
    icon: "i-heroicons-computer-desktop",
    to: "/virtualsport",
  },
  // { label: "Results", icon: "i-heroicons-chart-bar", to: "/" },
  { label: "Check Ticket", icon: "i-heroicons-ticket", to: "/betinfo/" },
  { label: "Rules", icon: "i-heroicons-document", to: "/retail_betting" },
];

const rightMenu = [
  { label: "Messages", to: "/notification", icon: "i-heroicons-envelope" },
  { label: "My profile", to: "/account" },
];

const accountMethods = [
  {
    label: "Deposit",
    to: "/payment/deposit",
  },
  {
    label: "Withdraw",
    to: "/payment/withdraw",
  },
  {
    label: "Transaction",
    to: "/payment/transaction",
  },
];

async function refreshBalance() {
  await auth.checkSession();
}

async function handleLogout() {
  await auth.logout();
  rightSidebarOpen.value = false;
  router.push("/home/upcoming");
}

onMounted(refreshBalance);
</script>

<template>
  <UApp>
    <!-- LEFT DRAWER -->
    <UDrawer
      v-model:open="sidebarOpen"
      :handle="false"
      class="block md:hidden px-0"
      direction="left"
    >
      <template #content>
        <div class="w-80 flex flex-col">
          <!-- HEADER -->
          <div class="flex items-center gap-2 p-2">
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-lucide-x"
              size="xl"
              @click="sidebarOpen = false"
            />
            <!-- <img
              src="https://arada.bet/files/webexIconsDesktop/assets/image/header/vamos-logo-desctop-white-new.svg"
              class="w-20"
            /> -->
            <svg
              width="32"
              height="32"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="100" cy="100" r="90" fill="#5A7F3F" />
              <path
                d="M70 105 L90 125 L130 80"
                stroke="#FFFFFF"
                stroke-width="20"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <svg
              width="100"
              height="20"
              viewBox="0 0 100 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <text
                x="0"
                y="15"
                font-size="15"
                font-family="Arial, sans-serif"
                fill="#fff"
                class="tracking-wider font-bold"
              >
                rightbet
              </text>
            </svg>
          </div>

          <USeparator color="warning" size="sm" />

          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-fire"
            :label="t('Promotions')"
            class="py-3 pl-6 text-lg uppercase animate-pulse"
            size="xl"
            to="/promotions"
            @click="sidebarOpen = false"
          />

          <!-- SPORTS -->
          <UButton
            color="warning"
            variant="soft"
            size="lg"
            class="w-full uppercase py-3 border-b rounded-none pl-6 relative"
            @click="showSportsSubmenu = !showSportsSubmenu"
            icon="i-heroicons-clock"
          >
            {{ t("Sports") }}
            <Icon
              :name="
                showSportsSubmenu
                  ? 'heroicons-chevron-up'
                  : 'heroicons-chevron-down'
              "
              class="text-lg absolute right-4"
            />
          </UButton>

          <div
            v-if="showSportsSubmenu"
            class="flex flex-col pl-6 py-2 bg-warning/10"
          >
            <UButton
              v-for="item in sportsSubmenu"
              :key="item.label"
              color="neutral"
              variant="ghost"
              size="md"
              :to="item.to"
              class="rounded-none py-2 border-b text-left uppercase"
              @click="sidebarOpen = false"
            >
              {{ t(item.label) }}
            </UButton>
          </div>

          <!-- MAIN MENU -->
          <UButton
            v-for="item in menuItems"
            :key="item.label"
            color="warning"
            variant="soft"
            size="lg"
            :icon="item.icon"
            :to="item.to"
            class="w-full uppercase py-3 border-b rounded-none pl-6"
            @click="sidebarOpen = false"
          >
            {{ t(item.label) }}
          </UButton>
        </div>
      </template>
    </UDrawer>

    <!-- RIGHT DRAWER -->
    <UDrawer
      v-model:open="rightSidebarOpen"
      :handle="false"
      class="block md:hidden px-0"
      direction="right"
    >
      <template #content>
        <div class="w-80 flex flex-col">
          <div class="flex items-center gap-2 p-2">
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-lucide-x"
              size="xl"
              @click="rightSidebarOpen = false"
            />
          </div>

          <USeparator color="warning" size="sm" />

          <!-- SIMPLE RIGHT MENU -->
          <UButton
            v-for="item in rightMenu"
            :key="item.label"
            color="warning"
            variant="soft"
            size="lg"
            :to="item.to"
            :icon="item.icon"
            class="w-full uppercase py-3 border-b rounded-none pl-6"
            @click="rightSidebarOpen = false"
          >
            {{ t(item.label) }}
          </UButton>

          <!-- MY BETS -->
          <UButton
            color="warning"
            variant="soft"
            size="lg"
            class="w-full uppercase py-3 border-b rounded-none pl-6 flex justify-between"
            @click="showMyBets = !showMyBets"
          >
            {{ t("My bets") }}
            <Icon
              :name="
                showMyBets ? 'heroicons-chevron-up' : 'heroicons-chevron-down'
              "
              class="text-lg"
            />
          </UButton>

          <div v-if="showMyBets" class="flex flex-col pl-6 py-2 bg-warning/10">
            <UButton
              color="neutral"
              variant="ghost"
              size="md"
              to="/bethistory"
              class="rounded-none py-2 border-b text-left uppercase"
              @click="rightSidebarOpen = false"
            >
              {{ t("Bet history") }}
            </UButton>
          </div>

          <!-- BALANCE -->
          <UButton
            color="warning"
            variant="soft"
            size="lg"
            class="w-full uppercase py-3 border-b rounded-none pl-6 flex justify-between"
            @click="showBalanceOptions = !showBalanceOptions"
          >
            {{ t("Balance") }}
            <Icon
              :name="
                showBalanceOptions
                  ? 'heroicons-chevron-up'
                  : 'heroicons-chevron-down'
              "
              class="text-lg"
            />
          </UButton>

          <div
            v-if="showBalanceOptions"
            class="flex flex-col pl-6 py-2 bg-warning/10"
          >
            <UButton
              v-for="text in accountMethods"
              :key="text.label"
              :to="text.to"
              color="neutral"
              variant="ghost"
              size="md"
              class="rounded-none uppercase py-2 border-b text-left"
              @click="rightSidebarOpen = false"
            >
              {{ t(text.label) }}
            </UButton>
          </div>

          <UButton
            :label="t('Sign out')"
            size="xl"
            @click="handleLogout"
            color="primary"
            variant="outline"
            class="uppercase w-[80%] flex justify-center mx-auto mt-4 text-sm"
          />
        </div>
      </template>
    </UDrawer>

    <!-- TOP BAR -->
    <div class="flex flex-col">
      <div class="flex items-center justify-between p-2">
        <div class="flex items-center gap-2">
          <UButton
            class="rounded-none px-2"
            color="neutral"
            variant="ghost"
            size="xl"
            trailing-icon="i-heroicons-bars-3"
            @click="sidebarOpen = true"
          />
          <USeparator orientation="vertical" color="primary" class="h-8" />

          <RouterLink to="/home/upcoming">
            <!-- <img
              src="https://arada.bet/files/webexIconsMobile/image/header/Vamos-logo-mobile-white-new.svg"
              class="w-12"
            /> -->
            <svg
              width="32"
              height="32"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="100" cy="100" r="90" fill="#5A7F3F" />
              <path
                d="M70 105 L90 125 L130 80"
                stroke="#FFFFFF"
                stroke-width="20"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </RouterLink>
        </div>

        <!-- AUTH -->
        <div v-if="!isLoggedIn" class="flex gap-2">
          <AuthButtons title="Login" to="/auth/login" />
          <AuthButtons title="Register" to="/auth/register" />
        </div>

        <div v-else class="flex gap-2">
          <div
            @click="showBalanceModal = true"
            class="flex flex-col items-end font-medium gap-1 text-xs"
          >
            <span
              >{{
                (auth.user.bBalance + auth.user.rBalance).toFixed(2)
              }}
              ETB</span
            >
            <span>ID: {{ auth.user.id }}</span>
          </div>

          <AuthButtons title="Deposit" to="/payment/deposit" />

          <UButton
            class="rounded-none px-2"
            color="neutral"
            variant="ghost"
            trailing-icon="i-heroicons-user-solid"
            @click="rightSidebarOpen = true"
          />
        </div>
      </div>

      <USeparator color="primary" />

      <main class="flex-1 py-0">
        <UContainer>
          <slot />
        </UContainer>
      </main>
    </div>

    <!-- BALANCE MODAL -->
    <Teleport to="body">
      <div
        v-if="showBalanceModal"
        class="fixed inset-0 bg-black/40 flex mt-14 items-start justify-center z-20"
      >
        <div class="bg-white shadow-lg w-full px-3 pt-2 relative text-black">
          <div
            class="flex justify-between text-sm py-2 border-b-2 border-gray-300"
          >
            <span>Balance</span>
            <span
              ><strong class="text-[#486333]">{{ auth.user.rBalance }}</strong>
              ETB</span
            >
          </div>

          <div
            class="flex justify-between text-sm py-2 border-b-2 border-gray-300"
          >
            <span>Point</span>
            <span class="font-semibold">{{ auth.user.bBalance }}</span>
          </div>

          <div
            class="flex justify-center py-2 border-b-2 border-gray-300 text-sm"
          >
            <span>1 POINT = 1 ETB</span>
          </div>

          <div
            @click="refreshBalance"
            class="flex justify-center bg-default text-white py-2 border-b-2 border-gray-300 mt-2 font-semibold text-sm"
          >
            REFRESH
          </div>

          <div
            @click="showBalanceModal = false"
            class="flex justify-center py-2 mt-2 mb-4 font-semibold text-black text-sm"
          >
            CLOSE
          </div>
        </div>
      </div>
    </Teleport>
  </UApp>
</template>
