<template>
  <ul class="courtsTable">
    <li class="court" v-for="court in courts">
      {{ court.id }}
    </li>
  </ul>
</template>

<script>

export default {
  name: 'courtsTable',
  props: ['courtsData'],
  data () {
    return {
      courts: null,
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