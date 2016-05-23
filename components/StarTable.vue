<template>
<span v-on:click="starer(table)">
	<icon v-if="table.isSelected" name="star"></icon>
	<icon v-else name="star-o"></icon>
</span>
</template>
<script>

export default {
    props: [
		'table'
	],
	data () {
		return {
		}
	},
	components: {
	},
	methods: {
		starer(table) {
			let self = this;
			console.log('table', table);
			alert('star ! ' + self.table._id);
		}
    }
}
</script>
<style>
</style>

