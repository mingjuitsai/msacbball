<template>
  <div class="courtsTable">
    <section class="court" v-for="court in courts" v-bind:key="court">
      <aside class="time-slot" v-bind:class="isAvailable(getTimeslotTimeStamp(timeslot)) ? 'time-slot--available' : 'time-slot--unavailable'" v-for="timeslot in timeslotLength" v-bind:key="timeslot"></aside>
    </section>
  </div>
</template>

<style lang='scss'>
  .court{
    width: percentage(1/8);
    display: inline-block;
  }

  .time-slot{
    min-height: 50px;
    border: 1px solid #000;
    &--available{
      background-color: teal;
    }

    &--unavailable{
      background-color: #ddd;
    }
  }
</style>

<script>

export default {
  name: 'courtsTable',
  props: ['courtsData'],
  data () {
    return {
      courts: null,
      timeslotLength: 56, // ((12 - 6) + (20 - 12)) * 2 * 2,
      courtsStartTime: '6:00am',
      courtsEndTime: '8:00pm'
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