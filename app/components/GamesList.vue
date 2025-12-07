<script setup>
const props = defineProps({
  games: {
    type: Array,
    required: true,
  },
  type: String,
});

const auth = useAuthStore();
const router = useRouter();
const loggedIn = computed(() => auth.loggedIn);

const emit = defineEmits(["select"]);

function select(game) {
  if (!loggedIn.value) {
    router.push("/auth/login");
  } else {
    if (props.type === "casino") {
      router.push(`/casino/${game.provider}`);
    } else if (props.type === "virtualsport") {
      router.push(`/virtualsport/${game.provider}`);
    }
  }
}
</script>

<template>
  <div
    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-2"
    id="app-scroll"
  >
    <div
      v-for="game in games"
      :key="game.id"
      class="rounded-xl overflow-hidden bg-white border hover:shadow transition cursor-pointer"
      @click="select(game)"
    >
      <img
        :src="game.image"
        :alt="game.name"
        class="w-full h-32 object-cover"
      />
      <div class="p-2 text-sm font-medium text-gray-800 truncate">
        {{ game.name }}
      </div>
    </div>
  </div>
</template>
