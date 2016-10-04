
// The entryPoint calls the project components.

'use strict'
var Vue = require('vue')

Vue.use(require('vue-resource'))



var facet = require('./facet.vue')
var metric = require('./metric.vue')
var tableau = require('./tableau.vue')
var chart = require('./chart.vue')

module.exports = new Vue({

  el: 'body',

  components: {

    // The left key corresponds to the html tag where the component is included.
    // For exemple, we put the table.vue component
    // into <instancestable></instancestable> in template.html.
    facet: facet,
    tableau: tableau,
    metric: metric,
    chart:chart
  }

})

