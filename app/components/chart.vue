<template>
<div class="histogram"></div>
</template>

<script>
/* global Chartist */
import MQS from 'mongodb-querystring'
const types = ['Line', 'Bar', 'Pie']
export default {
  props: {
    type: {
      type: String,
      default: 'Line',
      required: true,
      validator (value) {
        return types.indexOf(value) > -1
      }
    },
    field: {
      type: String,
      required: true
    }
  },
  mounted () {
    // const self = this
    // self.reload()
    this.$nextTick(this.reload)
  },
  data () {
    return {
      data: { labels: [], series: [] },
      options: {
        fullWidth: true,
        chartPadding: {
          right: 40
        }
      },
      responsiveOptions: []
    }
  },
  methods: {
    reload (done) {
      const self = this
      const qry = {
        field: '_columns.' + self.field + '.content',
        $sort: {
          value: -1
        },
        $limit: 10
      }
      const url = window.location.protocol
      .concat('//')
      .concat(window.location.host)
      .concat('/$distinct?')
      .concat(MQS.stringify(qry, {}))
      self.$http.get(url).then(function (response) {
        const labels = []
        const serie = []
        response.data.forEach(function (i) {
          labels.push(i['_id'])
          serie.push(i.value)
        })
        self.$copyArray(labels, self.data.labels)
        self.$copyArray([serie], self.data.series)
        self.chart = new Chartist[self.type](
          self.$el,
          self.data,
          self.options,
          self.responsiveOptions
        )
      })
    },
    $copyArray (from, to) {
      for (let i = 0; i < from.length; i++) {
        this.$set(to, i, from[i])
      }
    }
  }
}
</script>
