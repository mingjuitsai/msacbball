<template>
  <div class="app">
    <main class="main">
      
      <!-- Header -->
      <appHeader></appHeader>

      <!-- Courts timetable -->
      <div class="courtsTimetable">
        <!-- Timetable -->
        <courtsTimeTable v-bind:date="getCurrentDate(currentDateIndex)" v-bind:courtsData="getCourtsData(currentDateIndex)"></courtsTimeTable>
      </div>

    </main>
  </div>
</template>

<script>
import appHeader from './components/Header.vue';
import courtsTimeTable from './components/CourtsTimeTable.vue';
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
    'courtsTimeTable': courtsTimeTable,
  },
  methods: {
    getCourtsData: function(dateIndex) {
      return this.data.then(function(data){
        return data[dateIndex].courts;
      });
    },
    getCurrentDate: function(dateIndex) {
      return this.data.then(function(json){
        return json[dateIndex].date;
      });
    }
  },
  created: function() {
    var vm = this;
    vm.data = getJSON('../data/data.json');

    vm.data.then((data) => {
      console.log(data);
    });
  }
}
</script>
