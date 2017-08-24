<template>
  <div class="courtsTimeTable">

    <!-- Time Row -->
    <section class="timeRow" v-for="timeslot in timeslotLength">
      <!-- 
        TODO:Normal: Try alternative design / play with design
      -->
      <h4 class="timeRow__marker">
        <time v-if="timeslot % 2 === 1">
          {{ formatTime(getSlotTime(timeslot).start, 'hh:mm a') }}
        </time>
        <mark v-if="timeslot % 2 === 0">
          {{ formatTime(getSlotTime(timeslot).start, 'hh:mm a') }}
        </mark>
        <time v-if="timeslot === timeslotLength">
          {{ formatTime(getSlotTime(timeslot, 1).start, 'hh:mm a') }}
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
  name: 'courtsTimeTable',
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
    getSlotTime: function(timeslot, offset) {
      var vm = this;
      offset = offset ? offset : 0;
      // Caculate next time slot, 15 minutes after, then return formatted time
      if(vm.courtStartTime) {
        var slotTimeStart = new Date(vm.courtStartTime.getTime() + (timeslot - 1 + offset)*15*60*1000),
        slotTimeEnd = new Date(slotTimeStart + 15*60*1000);

        return {
          start: slotTimeStart,
          end: slotTimeEnd
        };
      } else {
        return false;
      }
    },

    /* TODO: Can we add this to the global scope, feels like it'd get used a lot */
    formatTime: function(dateObject, format) {
      format = format ? format : 'dddd MMMM Do, YYYY';
      if(dateObject && typeof dateObject.getMonth === 'function') {
        return fecha.format(dateObject, format);
      }
    },

    isAvailable: function(courtID, timeslot) {

      /* TODO: Seems a bit busy, simpler ?? */
      var vm = this, result,
      slotTime = vm.getSlotTime(timeslot),
      timeslotStart = slotTime.start.getTime(),
      timeslotEnd = slotTime.end.getTime();

      // console.log(timeslotStart, timeslotEnd);
      // console.log(new Date(timeslotStart), new Date(timeslotEnd));
      // console.log(new Date( available.start ).getTime(), new Date( available.end ).getTime());
      // console.log(new Date( available.start ), new Date( available.end ));

      result = vm.courts[courtID].available.some( function(available) {
        
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