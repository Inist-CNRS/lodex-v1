<template>
<nav class="navbar navbar-default navbar-static-top  navbar-inverse">
  <div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="#">Brand</a>
    </div>

    <!-- Collect the nav links, forms, and other content for toggling -->
    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <ul class="nav navbar-nav">
		<li v-for="table in store.allTables" class="nav-item" v-bind:class="{ 'active' : table.isSelected }">
			<a href="#" class="nav-link" v-on:click="choose(table)">{{ table.value }}</a>
		</li>
      </ul>
      <ul class="nav navbar-nav navbar-right">
        <li>
			<button class="btn btn btn-default navbar-btn" v-on:click="create(table)">+</button>
		</li>
	</ul>
    </div><!-- /.navbar-collapse -->
  </div><!-- /.container-fluid -->
</nav>
</template>
<script>
import sharedStore from './store.js'
import MQS from 'mongodb-querystring'

export default {
	ready () {
		let self = this;
		self.reload();
	},
	data () {
		return {
			store: sharedStore
		}
	},
	methods: {
		reload() {
			let self = this;
			let url = '/index/*?alt=min';
			self.$http.get(url).then(function (response) {
					if (Array.isArray(response.data)) {
					response.data.forEach(function(i, index) {
							response.data[index].isSelected = false
							})
					response.data[0].isSelected = true
					self.$set('store.allTables', response.data)
					self.$set('store.currentTable', response.data[0])
					}
					}, console.error);
		},
		choose(table) {
			let self = this;
			self.store.allTables.forEach(function(i, index) {
				self.store.allTables[index].isSelected = i.id === table.id ? true: false
			})
			self.$set('store.currentTable', table)
		},
		create(table) {
			let self = this;
			let query = {
				'typ' : 'form',
				'filename' : String('t').concat(this.store.allTables.length + 1).concat('.table')
			};
			let url = '/index/?' + MQS.stringify(query);
			console.log('post', url)
			let formData = {
				title: 'Table #' + (self.store.allTables.length + 1),
				since: Date.now()
			}
			self.$http.post(url, formData).then(function (response) {
				self.reload();
			}, console.error)
		}
    },
	components: {
	 }
}
</script>
