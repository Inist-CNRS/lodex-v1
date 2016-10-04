<template>
<div id="no-more-tables">
  <div class="pull-right">
    <span class="text-muted"><b>{{ from }} </b>–<b>{{ to }}</b></span>
    <div class="btn-group btn-group-sm">
      <button type="button" class="btn btn-default"  @click="pagePrev()"   :class="offset === 0 ? 'disabled' : ''">
        <span class="glyphicon glyphicon-chevron-left"></span>
      </button>
      <button type="button" class="btn btn-default"  @click="pageNext()">
        <span class="glyphicon glyphicon-chevron-right"></span>
      </button>
    </div>
  </div>
  <table class="table-bordered table-striped table-condensed cf">
    <thead class="cf">
      <tr>
      <th>URI</th>
      <th v-for="(colkey, col) in columns" @click="sortBy(colkey)" style="cursor: pointer;">
        <i v-if="sortKeys[colkey] === 1" class="fa fa-sort-up pull-right" aria-hidden="true"></i>
        <i v-if="sortKeys[colkey] === 0" class="fa fa-sort pull-right" aria-hidden="true"></i>
        <i v-if="sortKeys[colkey] === -1" class="fa fa-sort-down pull-right" aria-hidden="true"></i>
        {{ col.label }}
      </th>
    </thead>
    <tbody>
      <tr v-for="(index, doc) in items">
        <td data-title="URI">
          <a href="{{ doc._uri }}.html">{{ doc._wid }}</a>
        </td>
        <td v-for="(colkey, col) in columns">
          {{{ doc._columns[colkey].content.html }}}
        </td>
      </tr>
    </tbody>
  </table>
</div>
</template>

<script>
import MQS from 'mongodb-querystring'
export default {
  ready () {
    const self = this
    self.reload()
  },
  data () {
    return {
      step: 5,
      limit: 5,
      offset: 0,
      sortKeys: {},
      columns: {},
      items: []
    }
  },
  computed: {
    from: function () {
      return this.offset + 1
    },
    to: function () {
      return this.offset + this.limit
    }
  },
  methods: {
    reload (done) {
      const self = this
      const qry = {
        $limit: self.limit,
        $offset: self.offset,
        $sort: {}
      }
      Object
      .keys(self.sortKeys)
      .filter(function (a) { return self.sortKeys[a] !== 0 })
      .forEach(function (b) { qry.$sort['_columns.' + b + '.content'] = self.sortKeys[b] })
      const url = window.location.protocol
      .concat('//')
      .concat(window.location.host)
      .concat('/corpus.jsonad?')
      .concat(MQS.stringify(qry, {}))

      self.$http.get(url).then(function (response) {
        if (Object.keys(self.columns).length === 0) {
          const cols = {}
          const ksort = {}
          Object.keys(response.body[0]['_columns'])
          .filter(function (k) {
            return response.body[0]['_columns'][k].displayAreas &&
                   response.body[0]['_columns'][k].displayAreas.table === true
          })
          .forEach(function (k) { cols[k] = response.body[0]['_columns'][k]; ksort[k] = 0 })
          self.columns = cols
          self.sortKeys = ksort
        }
        console.log('items', response.body.length)
        if (response.body.length === undefined) {
          self.offset -= self.step
        }
        else {
          self.$set('items', response.body)
        }
      })
    },
    sortBy: function (key) {
      const self = this
      if (self.sortKeys[key] >= 0) {
        self.$set('sortKeys.' + key, -1)
      }
      else {
        self.$set('sortKeys.' + key, 1)
      }
      self.reload()
    },
    pageNext: function () {
      const self = this
      self.offset += self.step
      self.reload()
    },
    pagePrev: function () {
      const self = this
      self.offset -= self.step
      if (self.offset < 0) {
        self.offset = 0
      }
      self.reload()
    }
  }
}
</script>
<style>
th.active {
  color: #fff;
}

th.active .arrow {
  opacity: 1;
}

.arrow {
  display: inline-block;
  vertical-align: middle;
  width: 0;
  height: 0;
  margin-left: 5px;
  opacity: 0.66;
}

.arrow.asc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid #fff;
}

.arrow.dsc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #fff;
}
</style>
