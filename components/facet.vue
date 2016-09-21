<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
import MQS from 'mongodb-querystring'
export default {
	data () {
		return {
			msg: 'Hello World!'
		}
	},
	methods: {
		reload(done) {
			let self = this;
			let qry = {
				"field" : "_columns.title.content"
			}
			let url = window.location.protocol
			.concat('//')
			.concat(window.location.host)
			.concat('/$distinct')
			.concat(MQS.stringify(qry, {}));
			self.$http.get(url).then(function (response) {
				let rootTable = response.data[0]._id
				let url = self.store.s
			})
}
</script>
