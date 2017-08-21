<template>
  <div class="timeRow">
    
  </div>
</template>


<script>

const fecha = require('fecha');

export default {
  name: 'timeRow',
  data () {
    return {
      courts: null,
      timeslotLength: 56, // ((12 - 6) + (20 - 12)) * 2 * 2
    }
  },

  created: function() {

  }
}
</script>