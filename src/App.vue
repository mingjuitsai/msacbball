<template>
  <div class="app">
    <main class="main">
      
      <!-- Header -->
      <appHeader :date-index.sync="currentDateIndex"></appHeader>

      <!-- Courts timetable -->
      <div class="courtsTimetable">
      
        <!-- Timetable -->
        <courtsTimeTable :date="currentDate" :courts-data="currentCourtsData"></courtsTimeTable>
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
    }
  },
  components: {
    'appHeader': appHeader,
    'courtsTimeTable': courtsTimeTable,
  },
  computed: {
    currentDate: function() {
      if(this.masterDataJSON) {
        return this.masterDataJSON[this.currentDateIndex].date;
      }
    },
    currentCourtsData: function() {
      if(this.masterDataJSON) {
        return this.masterDataJSON[this.currentDateIndex].courts;
      }
    }
  }
}
</script>
