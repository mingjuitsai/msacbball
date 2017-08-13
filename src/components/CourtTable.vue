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
    vm.courtsData.then(function(data){
      console.log(data);
    });
  }
}
</script>