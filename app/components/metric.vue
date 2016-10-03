<template>
	<div class="text-center">
		<div class="circle-badge" style="background:#c4d735">
			<strong style="font-family: 'Oswald', sans-serif;  font-size: 28px;  font-weight: bold;" >{{ value }}</strong>
		</div>
		<div>
			<small class="mtitle">{{ title }}</small>
		</div>
	</div>
</template>

<script>
import MQS from 'mongodb-querystring'
export default {
	props: ['query', 'title', 'mode'],
	ready () {
		let self = this;
		self.reload();
	},
	data () {
		return {
			value : 0
		}
	},
	methods: {
		reload(done) {
			let self = this;
			let qry = {
				draw : Date.now()
			}
			let url = window.location.protocol
			.concat('//')
			.concat(window.location.host)
			.concat('/' + self.query )
			.concat('&'+MQS.stringify(qry, {}));
			self.$http.get(url).then(function (response) {
					if (self.mode === 'value') {
							self.value = response.data[0].value;
					}
					else {
							self.value = response.data.length;
					}

			})
		}
	}
}
</script>
<style>
.mtitle {
	font-family: 'Oswald', sans-serif;
	font-size: 14px;
	text-transform: uppercase;
}
</style>
