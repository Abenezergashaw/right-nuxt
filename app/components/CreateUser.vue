<script setup>
import { reactive, ref } from "vue";

defineProps({
  open: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close", "save"]);

const form = reactive({
  phone: "",
  password: "",
  deposit: null,
});

const error = ref("");

function close() {
  error.value = "";
  emit("close");
}

function save() {
  error.value = "";

  /* ---------- PHONE VALIDATION ---------- */
  if (!/^[97]\d{8}$/.test(form.phone)) {
    error.value = "Phone number must be 9 digits and start with 9 or 7.";
    return;
  }

  /* ---------- PASSWORD VALIDATION ---------- */
  if (!form.password || form.password.length < 8) {
    error.value = "Password must be at least 8 characters.";
    return;
  }

  /* ---------- DEPOSIT VALIDATION ---------- */
  //   if (
  //     form.deposit !== null &&
  //     form.deposit !== "" &&
  //     Number(form.deposit) < 10
  //   ) {
  //     error.value = "Deposit amount must be at least 10.";
  //     return;
  //   }

  /* ---------- EMIT VALID DATA ---------- */
  emit("save", {
    phone: form.phone, // 9xxxxxxx or 7xxxxxxx ONLY
    password: form.password,
    // deposit: form.deposit ? Number(form.deposit) : 0,
  });

  close();
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center"
    >
      <!-- Overlay -->
      <div class="absolute inset-0" @click="close"></div>

      <!-- Modal -->
      <div class="relative bg-black w-80 rounded-lg shadow-lg p-4 z-10">
        <h2 class="text-lg font-semibold mb-4">Create User</h2>

        <!-- Phone -->
        <div class="mb-3">
          <label class="block text-sm mb-1">Phone Number</label>
          <div class="flex gap-1">
            <input
              value="+251"
              type="text"
              class="w-[20%] border rounded px-2 py-1 text-sm"
              disabled
            /><input
              v-model="form.phone"
              type="text"
              placeholder="9xxxxxxxx"
              class="w-full border rounded px-2 py-1 text-sm"
            />
          </div>
        </div>

        <!-- Password -->
        <div class="mb-3">
          <label class="block text-sm mb-1">Password</label>
          <input
            v-model="form.password"
            type="password"
            class="w-full border rounded px-2 py-1 text-sm"
          />
        </div>

        <!-- Deposit (optional) -->
        <div v-if="false" class="mb-4">
          <label class="block text-sm mb-1">
            Deposit Amount <span class="text-gray-400">(optional)</span>
          </label>
          <input
            v-model.number="form.deposit"
            type="number"
            min="0"
            class="w-full border rounded px-2 py-1 text-sm"
          />
        </div>

        <p v-if="error" class="mb-3 text-sm text-red-500 px-2 py-1 rounded">
          {{ error }}
        </p>

        <!-- Actions -->
        <div class="flex justify-end gap-2">
          <button @click="close" class="px-3 py-1 text-sm border rounded">
            Cancel
          </button>

          <button
            @click="save"
            class="px-4 py-1 text-sm bg-green-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
