<template>
  <div class="courtsTimeTable">

    <!-- Time Row -->
    <section class="timeRow" v-bind:class="[getSlotTime(timeslot) ? 'timeRow--label' : 'timeRow--marker' ]" v-for="timeslot in timeslotLength">
      <h4 class="timeRow__time" v-if="getSlotTime(timeslot)">
        <time>
          {{ getSlotTime(timeslot) }}
        </time>
      </h4>

      <ul class="timeRow__courtSlots">
        <li class="timeslot" v-bind:class="[isAvailable(court.id, timeslot) ? 'available' : 'unavailable']" v-for="court in courts"></li>
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
      currentDate: null,
      courts: null,
      timeslotLength: 56, // = ((12 - 6) + (20 - 12)) * 2 * 2
    }
  },
  computed: {
    courtStartTime: function () {      
      var vm = this;
      if(vm.currentDate) {
        return new Date(vm.currentDate + 'T' + '06:00');
      }      
    },
    courtEndTime: function () {
      var vm = this;
      if(vm.currentDate) {
        return new Date(vm.currentDate + 'T' + '20:00');
      }
    }
  },
  methods: {
    getSlotTime: function(timeslot, timeFormat) {
      // Don't render the time if it's even
      // else caculate next time slot, 15 minutes after, then return formatted time
      timeFormat = timeFormat ? timeFormat : 'hh:mm a';
      var vm = this,
      result,
      figureSlotTime = function(steps) {
        steps = steps ? steps : 0;
        if(vm.courtStartTime) {
          return new Date(vm.courtStartTime.getTime() + (timeslot - 1 + steps)*15*60*1000);
        } else {
          return false;
        }
      };
      if( timeslot === vm.timeslotLength) {
        result = figureSlotTime(1);
      } /*else if( timeslot % 2 === 0) {
        return false;
      } */else {
        result = figureSlotTime();
      }

      // Return the formatted time
      if(result) {
        if(timeFormat === 'raw') {
          return result;
        } else {
          return fecha.format( result, timeFormat);
        }
      } else {
        return false;
      }      
    },

    isAvailable: function(courtID, timeslot) {
      var vm = this, result,
      timeslotStart = vm.getSlotTime(timeslot, 'raw').getTime(),
      timeslotEnd = timeslotStart + 15*60*1000;

      // console.log(timeslotStart, timeslotEnd);
      // console.log(new Date(timeslotStart), new Date(timeslotEnd));

      result = vm.courts[courtID].available.some( function(available) {
        // console.log(new Date( available.start ).getTime(), new Date( available.end ).getTime());
        // console.log(new Date( available.start ), new Date( available.end ));
        var availableStart = new Date( available.start ).getTime(),
        availableEnd = new Date( available.end ).getTime();

        if( timeslotStart >= availableStart && timeslotEnd <= availableEnd ) {
          return true;
        } else {
          return false;
        }
      });

      return result;
    }
  },
  created: function() {
    var vm = this;
    vm.courtsData.then(function(data){
      console.table(data[0].available);
      vm.courts = data;
    });
    vm.date.then(date => {
      vm.currentDate = date;
    });
  }
}
</script>