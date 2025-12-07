<script setup>
const props = defineProps({
  promo: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="max-w-4xl mx-auto p-4 bg-white dark:bg-zinc-900 shadow">
    <h1
      class="text-2xl uppercase font-bold mb-2 text-zinc-800 dark:text-zinc-100"
    >
      {{ promo.title }}
    </h1>
    <img
      :src="promo.image"
      :alt="promo.title"
      class="object-cover rounded-xl mb-6"
    />

    <p class="text-zinc-600 dark:text-zinc-300 mb-4">
      {{ promo.description }}
    </p>

    <p
      v-if="promo.moreDescription"
      class="text-zinc-700 dark:text-zinc-200 mb-6 leading-relaxed"
    >
      {{ promo.moreDescription }}
    </p>

    <div v-if="promo.howItWorks" class="mb-6">
      <h2 class="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-2">
        How It Works
      </h2>
      <ol
        class="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-300"
      >
        <li v-for="(step, index) in promo.howItWorks" :key="index">
          {{ step }}
        </li>
      </ol>
    </div>

    <div v-if="promo.bonusTable && promo.bonusTable.length" class="mb-6">
      <h2 class="text-lg font-semibold mb-3 text-black">Bonus Table</h2>
      <table
        class="w-full border border-zinc-300 text-black rounded-xl text-sm"
      >
        <thead class="bg-zinc-100 dark:bg-zinc-800">
          <tr>
            <th
              class="text-left p-2 border-b border-zinc-300 dark:border-zinc-700"
            >
              Events
            </th>
            <th
              class="text-left p-2 border-b border-zinc-300 dark:border-zinc-700"
            >
              Bonus
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in promo.bonusTable"
            :key="index"
            class="odd:bg-zinc-50 even:bg-white dark:odd:bg-zinc-900 dark:even:bg-zinc-800"
          >
            <td class="p-2 border-b border-zinc-200 dark:border-zinc-700">
              {{ item.events }}
            </td>
            <td class="p-2 border-b border-zinc-200 dark:border-zinc-700">
              {{ item.bonus }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="promo.importantNote"
      class="mt-6 border-t pt-4 border-zinc-200 dark:border-zinc-700"
    >
      <h2 class="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-2">
        Important Note
      </h2>
      <p class="text-zinc-600 dark:text-zinc-300">
        {{ promo.importantNote }}
      </p>
    </div>
  </div>
</template>

<style scoped>
table {
  border-collapse: collapse;
}
</style>
