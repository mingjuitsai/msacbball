<template>
  <div class="app">
    <main class="main">
      <!-- Header -->
      <appHeader></appHeader>

      <!-- Timetable -->
      <courtsTable v-bind:courtsData="getCourtsData(currentDateIndex)"></courtsTable>

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
      data: null,
      currentDateIndex: 0
    }
  },
  components: {
    'appHeader': appHeader,
    'courtsTable': courtsTable
  },
  methods: {
    getCourtsData: function(dateIndex) {
      return this.data.then(function(data){
        return data[dateIndex].courts;
      });
    }
  },
  created: function() {
    var vm = this;
    vm.data = getJSON('../data/data.json');
  }
}
</script>
