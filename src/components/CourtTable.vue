<template>
  <div class="courtsTable">
    <section class="court" v-for="court in courts" v-bind:key="court.id">
      <aside class="time-slot" v-for="timeslot in timeslotLength"></aside>
    </section>
  </div>
</template>


<script>
export default {
  name: 'courtsTable',
  props: [
    'courtsData',
    'date'
  ],
  data () {
    return {
      courts: null,
      timeslotLength: 56, // ((12 - 6) + (20 - 12)) * 2 * 2
    }
  },
  methods: {
    getTimeslotTimeStamp: function(timeslot) {
      
    },
    isAvailable: function(timestamp) {
      return Math.random() > 0.5;
    }
  },
  created: function() {
    var vm = this;
    vm.courtsData.then(function(data){
      console.table(data[0].unavailable);
      vm.courts = data;
    });
  }
}
</script>