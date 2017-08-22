<template>
  <div class="courtsTimeTable">

    <!-- Time Row -->
    <section class="timeRow" v-bind:class="[getSlotTime(timeslot) ? 'timeRow--label' : 'timeRow--marker' ]" v-for="timeslot in timeslotLength">
      <h4 class="timeRow__time" v-if="getSlotTime(timeslot)">
        <time>
          {{ getSlotTime(timeslot) }}
        </time>
      </h4>

      <ul class="courtSlots">
        <li class="timeslot" v-for="court in courts"></li>
      </ul>
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
    getSlotTime: function(timeslot) {
      // Don't render the time if it's even
      // else caculate next time slot, 15 minutes after, then return formatted time
      var vm = this,
      result,
      figureSlotTime = function(steps) {
        steps = steps ? steps : 0;
        return new Date(vm.courtStartTime.getTime() + (timeslot - 1 + steps)*15*60*1000);
      };
      if( timeslot === vm.timeslotLength) {
        result = figureSlotTime(1);
      } else if( timeslot % 2 === 0 ) {
        return false;
      } else {
        result = figureSlotTime();
      }

      // Return the formatted time
      return fecha.format( result, 'hh:mm a');
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