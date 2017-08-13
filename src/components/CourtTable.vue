<template>
  <div class="courtsTable">
  </div>
</template>

<script>

export default {
  name: 'courtsTable',
  props: ['courtsData'],
  created: function() {
    var vm = this;

    vm.courtsData.then(function(courtsData){
      console.log(courtsData);
    });
  }
}
</script>