'use strict';
var Vue = require('vue');


var Icon = require('vue-awesome/dist/vue-awesome');

Vue.component('icon', Icon);

Vue.use(require('vue-resource'));
Vue.use(require('vue-infinite-scroll'));

module.exports = new Vue({
  el: 'body',
  components: {
    App : require('./App.vue')
  }
})
