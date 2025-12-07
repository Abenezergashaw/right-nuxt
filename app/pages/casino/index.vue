<script setup>
import axios from "axios";
import CasinoTags from "~/components/CasinoTags.vue";
import ImageCarousel from "~/components/ImageCarousel.vue";
import ProvidersList from "~/components/ProvidersList.vue";

const url = useUrl().url;

definePageMeta({
  layout: "tertiary",
});

const tags = ref([]);
const activeTag = ref("all");
const providers = ref([]);
const activeProvider = ref({
  provider: "All",
  aggregator: "All",
});
const games = ref([]);
const page = ref(1);
const loadingGames = ref(true);
const loader = ref(false);

async function getTagList() {
  loader.value = true;
  const res = await axios.get(`${url}/api/getTagList?type=casino`);
  tags.value = res.data;
  tags.value = ["all", ...tags.value];
}

async function getProvidersList() {
  const res = await axios.get(`${url}/api/getProviderList?type=casino`);
  providers.value = res.data;
  providers.value = [
    {
      provider: "All",
      aggregator: "All",
    },
    ...providers.value,
  ];
  loader.value = false;
}

async function getGames(tag) {
  loadingGames.value = true;
  const res = await axios.get(
    `${url}/api/getGames?type=casino&page=${page.value}&tag=${activeTag.value}&provider=${activeProvider.value.provider}`
  );
  games.value.push(...res.data);
  page.value++;
  loadingGames.value = false;
}

async function onSelect(item) {
  page.value = 1;
  loadingGames.value = true;
  const res = await axios.get(
    `${url}/api/getGames?type=casino&page=${page.value}&tag=${activeTag.value}&provider=${activeProvider.value.provider}`
  );
  games.value = res.data;
  page.value++;
  loadingGames.value = false;
}
async function onChangeProvider(item) {
  page.value = 1;
  loadingGames.value = true;
  const res = await axios.get(
    `${url}/api/getGames?type=casino&page=${page.value}&tag=${activeTag.value}&provider=${activeProvider.value.provider}`
  );
  games.value = res.data;
  page.value++;
  loadingGames.value = false;
}

onMounted(async () => {
  await getTagList();
  await getProvidersList();
  await getGames();
});
</script>

<template>
  <ImageCarousel />
  <CasinoTags :items="tags" v-model="activeTag" @select="onSelect" />
  <ProvidersList
    :items="providers"
    v-model="activeProvider"
    @select="onChangeProvider"
  />
  <GamesList :games="games" type="casino" />
  <div class="flex justify-center">
    <UButton
      :loading="loadingGames"
      loading-icon="i-heroicons-paper-airplane"
      label="Load more"
      @click="getGames"
      class="my-2"
    />
  </div>
  <div class="w-full">
    <Loader :loader="loader" />
  </div>
</template>
