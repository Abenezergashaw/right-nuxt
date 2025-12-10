<script setup>
import { reactive } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useUrl } from "@/stores/url";
import { t } from "@/composables/locales";

definePageMeta({
  layout: "secondary",
});

const auth = useAuthStore();

const isLoggedIn = computed(() => auth.loggedIn);

const router = useRouter();

const form = reactive({
  phone: "",
  password: "",
  rememberMe: true,
});

const loggingIn = ref(false);

async function submitForm() {
  loggingIn.value = true;
  const phone = form.phone.replace(/\D/g, "");

  if (phone.length !== 9) {
    auth.loginError = "Invalid phone number";
    loggingIn.value = false;

    return;
  }

  if (!phone.startsWith("7") && !phone.startsWith("9")) {
    auth.loginError = "Invalid phone number";
    loggingIn.value = false;

    return;
  }

  if (!form.password || form.password.length < 8) {
    auth.loginError = "Password must be at least 8 characters.";
    loggingIn.value = false;

    return;
  }

  form.phone = phone;

  const ok = await auth.submitLogin(form);
  // alert(ok);
  if (!ok) return;
  router.push("/home/upcoming");
}

onMounted(() => {
  if (isLoggedIn.value) {
    router.push("/home/upcoming");
  }
});
</script>

<template>
  <UCard
    class="w-full max-w-sm mt-6 rounded-none py-0 px-6 border-none mx-auto bg-default mb-48"
  >
    <div class="mb-4">
      <h2 class="text-xl font-semibold uppercase">{{ t("Login") }}</h2>
    </div>

    <USeparator class="mb-4" color="primary" />

    <form class="space-y-4 mt-0" @submit.prevent="submitForm">
      <div class="text-sm">{{ t("Phone number, username or ID") }}</div>

      <UInput
        v-model="form.phone"
        type="tel"
        :placeholder="t('Phone number, username or ID')"
        class="w-full bg-white rounded-none text-black"
        :ui="{ base: 'bg-white text-black rounded-none' }"
      />

      <div class="text-sm">{{ t("Password") }}</div>

      <UInput
        v-model="form.password"
        type="password"
        :placeholder="t('Enter your password')"
        class="w-full bg-white rounded-none"
        :ui="{ base: 'bg-white text-black rounded-none' }"
      />

      <div class="flex justify-between items-center text-xs">
        <div>{{ t("Remember me") }}</div>
        <USwitch v-model="form.rememberMe" />
      </div>

      <div
        v-if="auth.loginError"
        class="text-red-300 tracking-wider text-sm mt-2 text-center"
      >
        {{ auth.loginError }}
      </div>

      <UButton
        type="submit"
        color="primary"
        block
        class="mt-2 text-center uppercase"
        :loading="loggingIn"
        loading-icon="i-lucide-loader"
      >
        {{ t("Login") }}
      </UButton>
    </form>

    <div class="text-xs text-center my-4 tracking-wider">
      <RouterLink
        to="/restore_password"
        class="text-[#05DF72] cursor-pointer"
        >{{ t("Restore password") }}</RouterLink
      >
      {{ t("or") }}
      <span class="text-[#05DF72] cursor-pointer">{{ t("Contact us") }}</span>
    </div>

    <USeparator class="my-4" color="primary" />

    <div class="text-xs text-center my-4 tracking-wider">
      <span>{{ t("Don't have an account?") }}</span>
    </div>

    <UButton
      color="primary"
      to="/auth/register"
      block
      class="mt-2 text-center uppercase"
    >
      {{ t("Register") }}
    </UButton>
  </UCard>
</template>
