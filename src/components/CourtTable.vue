<template>
  <div class="courtsTable">
    <section class="timeRow" v-for="timeslot in timeslotLength+1">
      <time> {{ getCourtTime(timeslot) }} </time>
    </section>
  </div>
</template>


<script>
const fecha = require('fecha');

export default {
  name: 'courtsTable',
  props: [
    'courtsData',
    'date'
  ],
  data () {
    return {
      courts: null,
      timeslotLength: 56, // = ((12 - 6) + (20 - 12)) * 2 * 2
      courtStartTime: new Date(1988, 9, 9, 6, 0, 0),
      courtEndTime: new Date(1988, 9, 9, 20, 0, 0)
    }
  },
  methods: {
    getCourtTime: function(timeslot) {
      // Every timeslot is 15 minutes
      var vm = this;
      return fecha.format( new Date(vm.courtStartTime.getTime() + (timeslot - 1)*15*60*1000), 'hh:mm A');
    },
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