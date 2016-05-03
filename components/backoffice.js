'use strict';
var Vue = require('vue');

Vue.use(require('vue-resource'));
Vue.use(require('vue-infinite-scroll'));

module.exports = new Vue({
  el: 'body',
  components: {
    App : require('./App.vue')
  }
})
