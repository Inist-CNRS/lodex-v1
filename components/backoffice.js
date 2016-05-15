'use strict';
var Vue = require('vue');


var Icon = require('vue-awesome/dist/vue-awesome');
Vue.component('icon', Icon);
Vue.component('modal', require('vue-strap/dist/vue-strap.min').modal)


Vue.use(require('vue-resource'));
Vue.use(require('vue-infinite-scroll'));

module.exports = new Vue({
  el: 'body',
  components: {
    App : require('./App.vue')
  }
})
