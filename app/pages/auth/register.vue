<script setup lang="ts">
import { t } from "@/composables/locales";

definePageMeta({
  layout: "tertiary",
});

const auth = useAuthStore();
const router = useRouter();
const loggedIn = computed(() => auth.loggedIn);
const registerError = computed(() => auth.registerError);

const rememberMe = ref(true);

const days = Array.from({ length: 31 }, (_, i) => ({
  label: String(i + 1).padStart(2, "0"),
  value: i + 1,
}));

// Months 1-12
const months = Array.from({ length: 12 }, (_, i) => ({
  label: String(i + 1).padStart(2, "0"),
  value: i + 1,
}));

// Years (example: 1990 - 2030)
const years = Array.from({ length: 2004 - 1950 + 1 }, (_, i) => {
  const y = 2004 - i;
  return { label: String(y), value: y };
});

// Selected values
const selectedDay = ref<number | undefined>(undefined);
const selectedMonth = ref<number | undefined>(undefined);
const selectedYear = ref<number | undefined>(undefined);

// Computed full date string
const fullDate = computed(() => {
  if (selectedDay.value && selectedMonth.value && selectedYear.value) {
    return `${String(selectedDay.value).padStart(2, "0")}/${String(
      selectedMonth.value
    ).padStart(2, "0")}/${selectedYear.value}`;
  }
  return "";
});

// Refs for the other inputs
const phoneNumber = ref("");
const password = ref("");
const confirmPassword = ref("");
const promoCode = ref("");
const registering = ref(false);

// Function to gather all input data
async function handleConfirm(e: Event) {
  e.preventDefault();
  registering.value = true;

  // raw form values
  const phone = phoneNumber.value?.trim();
  const pass = password.value;
  const cpass = confirmPassword.value;
  const dob = fullDate.value;
  const promo = promoCode.value;
  const remember = rememberMe.value;

  // VALIDATION
  // 1) Null / empty checks
  if (!phone || !pass || !cpass || !dob) {
    registering.value = false;
    auth.registerError = "All required fields must be filled.";
    return;
  }

  // 2) Phone rules: must start with 7 or 9, must be 9 digits total
  const phoneRegex = /^[79]\d{8}$/;
  if (!phoneRegex.test(phone)) {
    registering.value = false;
    auth.registerError = "Invalid phone number format.";
    return;
  }

  // 3) Password ≥ 8 characters
  if (pass.length < 8) {
    registering.value = false;
    auth.registerError = "Password must be at least 8 characters.";
    return;
  }

  // 4) Password match
  if (pass !== cpass) {
    registering.value = false;
    auth.registerError = "Passwords do not match.";
    return;
  }

  // If valid → construct request
  const formData = {
    phone,
    password: pass,
    confirmPassword: cpass,
    dateOfBirth: dob,
    promoCode: promo || null,
    rememberMe: remember || false,
  };

  const ok = await auth.register(formData);
  if (!ok) {
    registering.value = false;
    return;
  }

  registering.value = false;
  router.push("/home/upcoming");
}

onMounted(() => {
  if (loggedIn.value) {
    router.push("/home/upcoming");
  }
});
</script>

<template>
  <div class="h-screen overflow-y-auto">
    <UCard
      class="w-full rounded-none mx-auto max-w-sm mt-6 pb-4 px-2 border-none"
    >
      <div class="mb-4">
        <h2 class="text-lg font-semibold uppercase">
          {{ t("Create your Account") }}
        </h2>
      </div>

      <USeparator class="mb-4" color="primary" />

      <form class="space-y-4 mt-0 pb-4" @submit="handleConfirm">
        <div class="text-xs">{{ t("Phone number") }} *</div>

        <div>
          <UInput
            label="Phone Number"
            type="tel"
            placeholder="+251"
            class="w-[20%] bg-white rounded-none"
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
            :ui="{
              base: 'bg-white rounded-none text-black',
            }"
          />
        </div>

        <div class="text-xs">{{ t("Password") }} *</div>

        <UInput
          label="Password"
          type="password"
          v-model="password"
          :placeholder="t('Enter Password')"
          class="w-full bg-white rounded-none"
          :ui="{
            base: 'bg-white rounded-none text-black',
          }"
        />

        <div class="text-xs">{{ t("Confirm Password") }} *</div>

        <UInput
          label="Password"
          type="password"
          v-model="confirmPassword"
          :placeholder="t('Confirm Password')"
          class="w-full bg-white rounded-none text-black"
          :ui="{
            base: 'bg-white rounded-none text-black',
          }"
        />

        <div class="text-xs">{{ t("Date of birth") }} *</div>

        <div class="flex gap-2 items-center my-4">
          <!-- Day -->
          <USelect
            v-model="selectedDay"
            :items="days"
            placeholder="Day"
            class="flex-1"
            :ui="{
              base: 'bg-white rounded-none text-black',
            }"
          />

          <!-- Month -->
          <USelect
            v-model="selectedMonth"
            :items="months"
            placeholder="Month"
            class="flex-1"
            :ui="{
              base: 'bg-white rounded-none text-black',
            }"
          />

          <!-- Year -->
          <USelect
            v-model="selectedYear"
            :items="years"
            placeholder="Year"
            class="flex-1"
            :ui="{
              base: 'bg-white rounded-none text-black',
            }"
          />
        </div>

        <div class="text-xs mt-8">{{ t("Promo code") }}</div>

        <UInput
          label="Promo"
          type="text"
          v-model="promoCode"
          :placeholder="t('Enter promo code')"
          class="w-full bg-white rounded-none text-black"
          :ui="{
            base: 'bg-white rounded-none text-black',
          }"
        />

        <div class="flex justify-between text-xs">
          <div class="flex-1">
            {{ t("By clicking button below, you agree to our") }}<br /><span
              class="text-primary"
              >{{ t("Rules") }}</span
            >
            *
          </div>
          <USwitch v-model="rememberMe" />
        </div>

        <USeparator class="my-4" color="primary" />

        <div
          v-if="auth.registerError"
          class="text-red-300 tracking-wider text-xs mt-2 text-center"
        >
          {{ auth.registerError }}
        </div>

        <UButton
          type="submit"
          color="primary"
          block
          :loading="registering"
          loading-icon="i-lucide-loader"
          class="mt-1 text-center uppercase"
        >
          {{ t("Confirm") }}
        </UButton>
      </form>
    </UCard>
  </div>
</template>
