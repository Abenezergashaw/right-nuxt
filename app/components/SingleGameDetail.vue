<script setup>
const route = useRoute();

// route.params.slug is an array:
// [
//   "Football",
//   "Germany",
//   "DFB_Pokal",
//   "Borussia_Monchengladbach_V_FC_St._Pauli_id35829559"
// ]

console.log(route.params.slug);

// You can extract the last segment (event id)
const last = route.params.slug.at(-1);
const eventId = last.split("_id")[1]; // -> 35829559
const eventName = last.split("_id")[0]; // -> Borussia_Monchengladbach_V_FC_St._Pauli
</script>

<template>
  <div>
    <h1>Event Page</h1>

    <pre>{{ route.params.slug }}</pre>
    <p>Event ID: {{ eventId }}</p>
    <p>Event Name: {{ eventName }}</p>
  </div>
</template>
