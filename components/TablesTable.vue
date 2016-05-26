<template>
<div id="tables-item" class="row">
	<table class="table table-bordered" data-resizable-columns-id="table-html">
		<thead>
			<tr>
				<th data-resizable-column-id="column-index"></th>
				<th data-resizable-column-id="column-uri">URI</th>
				<th v-for="(name, field) in columns" data-resizable-column-id="column-{{name}}">
					<span>{{ field.label }}</span>
					<a href="" class="action-editcolumn pull-right" data-toggle="modal" data-target="#modal-editcolumn" role="button" data-column='{{ name }}' ><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a>
				</th>
				<th data-resizable-column-id="column-buttons"></th>
			</tr>
		</thead>
		<tbody id="items-tbody"  v-infinite-scroll="loadMore()" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
			<tr v-for="item in items">
				<td>
				  #{{ $index }}
				</td>
				<td>
				  <a href="{{ item['@id'] }}/">{{ item['@id'] | uri }}</a>
				</td>
				<td v-for="(name, field) in columns" data-resizable-column-id="column-{{name}}">
					<span>{{ item[name] }}</span>
		        </td>
				<td>
				  <a style="margin: 2px" title="CSV file" href="./[[ item._content.jsonld|get('_wid') ]]/*?alt=csv"><span class="fa fa-table"></span></a>
				  <a style="margin: 2px" title="N-Quads file" href="./[[ item._content.jsonld|get('_wid') ]]/*?alt=nq"><span class="fa fa-bars"></span></a>
				  <a style="margin: 2px" title="JSON LD file" href="./[[ item._content.jsonld|get('_wid') ]]/*?alt=json"><span class="fa fa-file-o"></span></a>
				  <a style="margin: 2px" title="RAW file" href="./[[ item._content.jsonld|get('_wid') ]]/*?alt=raw"><span class="fa fa-file-code-o"></span></a>
				</td>
			</tr>
		</tbody>
	</table>
</div>
</template>
<script>
import sharedStore from './store.js'
import MQS from 'mongodb-querystring'


var count = 0;
export default {
	ready () {
		let self = this;
		this.$watch('store.currentTable', function (newVal, oldVal) {
				let url1 = 'http://localhost:3000/index/' + self.store.currentTable.name + '/$_columns';
				self.$http.get(url1).then(function (response) {
					if (Array.isArray(response.data)) {
						console.log('columns', response.data[0].value)
						self.$set('columns', response.data[0].value)
					}
				}, console.error)
        self.page = 1
        self.maxpage = 1000000
        self.items = []
        self.load()
		})
	},
	data () {
		return {
      items : [],
      maxpage: 100000,
      page : 1,
      columns : {},
			store : sharedStore,
      busy: false
		}
	},
  components: {
  },
  methods: {
    load(done) {
      let self = this;
      let limit = 5;
      let page = Number(self.page)
      page = Number.isNaN(page) ? 1 : page
      let offset = limit * (page - 1)
      let  query = {
        'alt' : 'jsonld',
        //          '$orderby': {},
        '$offset': Number(offset),
        '$limit': Number(limit)
      };

      let url2 = 'http://localhost:3000/' + self.store.currentTable.name + '/*?' + MQS.stringify(query);
      console.log('refresh', url2);
      self.$http.get(url2).then(function (response) {
        if (Array.isArray(response.data)) {
          console.log('items', response.data)
          if (response.data.length > 0) {
            response.data.forEach(function(item) {
              self.items.push(item);
            }
          )}
          else {
            console.log('maxpage', self.page)
            self.maxpage = self.page;
          }
        }
        if (typeof done === 'function') {
          done();
        }
      }, console.error);
    },
    loadMore () {
      let self = this;
      self.page++;
      if (self.page < self.maxpage) {
        self.busy = true;
        console.log('Load more page #', self.page);
        self.load(() => {
          self.busy = false;
        })
      }
    }
  }
}
</script>
<style>
#tables-item {
  padding-top : 4px;
  padding-left: 16px;
  padding-right: 16px;
}
</style>
