<script setup>
import axios from "axios";
definePageMeta({
  layout: "secondary",
});

const auth = useAuthStore();
const url = useUrl().url;

const id = computed(() => auth.user.id);
const isLoggedIn = computed(() => auth.loggedIn);

const phone = computed(() => {
  return "+251" + auth.user.phone;
});

const oldPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

const responseState = ref(false);
const responseMessage = ref("");

async function handleChangePassword() {
  const res = await axios.post(
    `${url}/api/changePassword`,
    {
      oldPassword: oldPassword.value,
      newPassword: newPassword.value,
      confirmPassword: confirmPassword.value,
    },
    {
      withCredentials: true,
    }
  );

  responseState.value = res.data.error;
  responseMessage.value = res.data.message;
}
onMounted(() => {
  if (isLoggedIn.value) {
    router.push("/home/upcoming");
  }
});
</script>

<template>
  <div class="h-screen overscroll-y-auto">
    <div class="flex items-center py-6 px-4 bg-default text-xl uppercase">
      My Account
    </div>

    <div class="flex flex-col gap-4 px-4 py-4">
      <div class="uppercase text-sm text-black font-semibold">
        personal info
      </div>
      <UInput
        v-model="id"
        type="text"
        class="w-full bg-white rounded-none text-black"
        size="xl"
        disabled
        :ui="{ base: 'bg-white text-black rounded-none' }"
      />
      <UInput
        v-model="phone"
        type="text"
        class="w-full bg-white rounded-none text-black"
        size="xl"
        disabled
        :ui="{ base: 'bg-white text-black rounded-none' }"
      />
    </div>

    <div class="flex flex-col gap-4 px-4 py-4">
      <div class="uppercase text-sm text-black font-semibold">
        change password
      </div>
      <UInput
        v-model="oldPassword"
        type="password"
        class="w-full bg-white rounded-none text-black"
        size="xl"
        placeholder="Old password"
        :ui="{ base: 'bg-white text-black rounded-none' }"
      />
      <UInput
        v-model="newPassword"
        type="password"
        class="w-full bg-white rounded-none text-black"
        size="xl"
        placeholder="New password"
        :ui="{ base: 'bg-white text-black rounded-none' }"
      />
      <UInput
        v-model="confirmPassword"
        type="password"
        class="w-full bg-white rounded-none text-black"
        size="xl"
        placeholder="Confirm password"
        :ui="{ base: 'bg-white text-black rounded-none' }"
      />
      <div
        v-if="responseMessage"
        class="text-center"
        :class="`${responseState ? 'text-red-500' : 'text-primary'}`"
      >
        {{ responseMessage }}
      </div>
      <UButton
        @click="handleChangePassword"
        block
        class="mt-2 text-center uppercase bg-default text-white"
        size="xl"
        :loading="changingPassword"
        loading-icon="i-lucide-loader"
      >
        {{ t("Change password") }}
      </UButton>
    </div>

    <div class="flex flex-col gap-4 px-4 py-4 text-black text-sm">
      If you want to change your number please contact via chat or telegram.
    </div>
  </div>
</template>
