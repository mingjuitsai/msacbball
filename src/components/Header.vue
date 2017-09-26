<template>
  <header class="app-header">
    <h1 class="app-header__title">
      <strong>MSAC</strong> basketball courts availability
    </h1>
    
    <select v-model="currentIndex" @change="dateSelectChanged(currentIndex)">
      <option :value="index" v-for="(data, index) in masterDataJSON">
        {{ formatTime(new Date(data.date)) }}
      </option>
    </select>
  </header>
</template>

<script>
export default {
  name: 'appHeader',
  props: [
    'dateIndex',
  ],
  data() {
    return {
      currentIndex: this.dateIndex
    }
  },
  methods: {
    dateSelectChanged: function(currentIndex) {
      this.$emit('update:dateIndex', currentIndex);
    }
  }
}
</script>