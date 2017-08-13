<template>
  <div class="app">
    <main class="main">
      <!-- Header -->
      <appHeader></appHeader>

      <!-- Timetable -->
      <courtsTable v-bind:courtsData="courtsData"></courtsTable>

    </main>
  </div>
</template>

<script>
import appHeader from './components/Header.vue';
import courtsTable from './components/CourtTable.vue';
import { getJSON } from './scripts/modules/get.js';

export default {
  name: 'app',
  data () {
    return {
      courtsData: getJSON('../data/data.json')
    }
  },
  components: {
    'appHeader': appHeader,
    'courtsTable': courtsTable
  },
  created: function() {
  }
}
</script>
