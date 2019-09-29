import Vue from 'vue'
import App from './App.vue'
require('./styles/main.scss');

import { getJSON } from './scripts/modules/get.js';
const fecha = require('fecha');

Vue.mixin({
  data: function() {
    return {
      currentDateIndex: 0,
      masterData: getJSON('data/data.json'),
      masterDataJSON: null
    }
  },
  methods: {
    formatTime: function(dateObject, format) {
      format = format ? format : 'ddd Do MMM YYYY';
      if(dateObject && typeof dateObject.getMonth === 'function') {
        return fecha.format(dateObject, format);
      }
    }
  },
  created: function() {
    var vm = this;
    vm.masterData.then( (json) => {
      vm.masterDataJSON = json;
    });
  }
});

new Vue({
  el: '#app',
  render: h => h(App),
  data: {
    a: 'test'
  }
})
