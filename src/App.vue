<template>
  <div id="app">
    <!-- Header -->
    <appHeader></appHeader>

    
    
  </div>
</template>

<script>
import appHeader from './components/Header.vue';

export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components: {
    'appHeader': appHeader
  }
}
</script>
