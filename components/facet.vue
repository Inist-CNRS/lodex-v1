<template>
  <div>
	  <hr />
	  <h3>{{ title }}</h3>
	  <ul class="nav nav-pills nav-stacked">
		  <li v-for="item in items" class="">
				<span class="badge pull-right">{{ item.value }}</span><a href="#">{{ item._id }}</a>
		  </li>
	  </ul>
  </div>
</template>

<script>
import MQS from 'mongodb-querystring'
export default {
	props: ['field', 'title'],
	ready () {
		let self = this;
		self.reload();
	},
	data () {
		return {
			items: []
		}
	},
	methods: {
		reload(done) {
			let self = this;
			let qry = {
				"field" : "_columns." + self.field + ".content",
				"$limit" : 5,
				"$sort" : {
					"value" : -1
				}
			}
			let url = window.location.protocol
			.concat('//')
			.concat(window.location.host)
			.concat('/$distinct?')
			.concat(MQS.stringify(qry, {}));
			self.$http.get(url).then(function (response) {
				self.items = response.data;
			})
		}
	}
}
</script>
