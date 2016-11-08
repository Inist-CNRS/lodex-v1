
// The entryPoint calls the project components.

// http://vuejs.org/guide/installation.html#Standalone-vs-Runtime-only-Build
var Vue = require('vue/dist/vue.js')

Vue.use(require('vue-resource'))

var bag = require('./bag.vue')
var chart = require('./chart.vue')
var embeduri = require('./embeduri.vue')
var facet = require('./facet.vue')
var istex = require('./istex.vue')
var knownuri = require('./uri.vue')
var metric = require('./metric.vue')
var picture = require('./picture.vue')
var tableau = require('./tableau.vue')

module.exports = new Vue({

  el: '#content',

  components: {

    // The left key corresponds to the html tag where the component is included.
    // For exemple, we put the table.vue component
    // into <instancestable></instancestable> in template.html.
    facet: facet,
    tableau: tableau,
    metric: metric,
    chart: chart,
    picture: picture,
    knownuri: knownuri,
    embeduri: embeduri,
    istex: istex,
    bag: bag
  }

})

