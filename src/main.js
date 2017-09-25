import Vue from 'vue'
import App from './App.vue'
require('./styles/main.scss');
const fecha = require('fecha');

Vue.mixin({
  methods: {
    formatTime: function(dateObject, format) {
      format = format ? format : 'dddd MMMM Do, YYYY';
      if(dateObject && typeof dateObject.getMonth === 'function') {
        return fecha.format(dateObject, format);
      }
    }
  }
});

new Vue({
  el: '#app',
  render: h => h(App)
})
