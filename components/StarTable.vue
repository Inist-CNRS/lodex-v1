<template>
<span v-on:click="starer(table)">
	<icon v-if="table.isRoot" name="star"></icon>
	<icon v-else name="star-o"></icon>
</span>
</template>
<script>

export default {
    props: [
		'table'
	],
	methods: {
		starer(table) {
			const self = this;
			const idt = self.table.name;
			const url = '/-/setroot/';
			const dta = {
				'origin': idt,
				'isRoot': true
			};
			self.$http.post(url, dta).then(function (response) {
					self.$dispatch('stared', self.table);

			}, console.error);
		}
    }
}
</script>
<style>
</style>

