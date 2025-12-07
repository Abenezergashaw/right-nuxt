<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { t } from "@/composables/locales";
import { useCountryFlag } from "@/composables/useFlags";

const { getFlag } = useCountryFlag();

definePageMeta({ layout: "secondary" });

const url = useUrl().url;

const route = useRoute();
const router = useRouter();

const data = route.query.game;
const countriesList = ref([]);
const loader = ref(false);
// const filteredSport = ref("Football");
const filteredSport = computed(() => data);
const demoFiletredSport = ref(data || "Football");
const currentTime = ref("Filter by Time");
const openedCountries = ref([]);

watch(demoFiletredSport, (newVal) => {
  // router.push(`/sport/events/countries?game=${newVal}`);
  router.push({
    path: "/sport/events/countries",
    query: { game: newVal },
  });
});

const timeFilters = [
  "Filter by Time",
  "1 hour",
  "3 hours",
  "6 hours",
  "12 hours",
  "1 day",
  "3 days",
];

watch(currentTime, async (newVal) => {
  await getGamesByCountry(newVal);
});

async function getGamesByCountry(filter = "Filter by Time") {
  loader.value = true;
  try {
    const res = await axios.post(`${url}/api/countriesList`, { filter });
    if (!res.data.error) {
      countriesList.value = res?.data?.[0]?.data?.sportList || [];
    }
  } catch (e) {
    console.error("Failed to fetch countries:", e);
  } finally {
    loader.value = false;
  }
}

const currentSportData = computed(() => {
  return (
    countriesList.value.find(
      (c) => c.sportName === demoFiletredSport.value
    ) || {
      countries: [],
      sportId: null,
    }
  );
});

const sportList = computed(() => {
  return countriesList.value.map((s) => ({
    label: t(s.sportName),
    value: s.sportName,
  }));
});

const timeList = computed(() => {
  return timeFilters.map((s) => ({
    label: t(s),
    value: s,
  }));
});

function handleOpenCloseCountry(index) {
  const i = openedCountries.value.indexOf(index);
  if (i === -1) openedCountries.value.push(index);
  else openedCountries.value.splice(i, 1);
}

onMounted(() => getGamesByCountry());
</script>

<template>
  <Loader :loader="loader" />
  <div class="h-screen overflow-auto">
    <div
      class="py-5 w-full px-3 flex gap-2 justify-center items-center text-white bg-default"
    >
      <USelect
        :ui="{ base: 'bg-white text-black' }"
        size="xl"
        class="w-full rounded-none py-2"
        v-model="demoFiletredSport"
        :items="sportList"
      />
      <USelect
        :ui="{ base: 'bg-white text-black' }"
        size="xl"
        class="w-full rounded-none py-2"
        v-model="currentTime"
        :items="timeList"
      />
    </div>

    <div v-for="(c, index) in currentSportData.countries" :key="index" class="">
      <div
        @click="handleOpenCloseCountry(index)"
        class="bg-white my-1 py-[11px] px-4 font-bold text-sm relative flex items-center justify-between"
      >
        <div class="flex gap-2 items-center text-black">
          <img :src="`/flags/${getFlag(c.name)}`" alt="" class="w-6 h-4" />
          <span>{{ t(c.name) }}</span>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-[#647EC3]">{{ c?.leagues?.length ?? 0 }}</span>
          <Icon
            name="heroicons:chevron-down"
            :class="[
              'text-lg text-black',
              openedCountries.includes(index) ? ' rotate-180' : '',
            ]"
          />
        </div>
      </div>

      <RouterLink
        v-if="openedCountries.includes(index)"
        v-for="l in c.leagues"
        :key="l.competitionName"
        :to="`/sport/leagues/${currentSportData.sportId}/${c.name}/${l.competitionName}/${demoFiletredSport}`"
        class="w-[98%] mx-auto mt-1 mb-2 py-2.5 px-11 font-bold text-sm bg-white relative text-black block"
      >
        {{ t(l.competitionName) }}
        <span class="absolute top-1.5 right-7 text-[#647EC3]">{{
          l.eventsCount
        }}</span>
        <ChevronRightIcon class="h-4 w-4 absolute top-2 right-1.5" />
      </RouterLink>
    </div>
  </div>
</template>
