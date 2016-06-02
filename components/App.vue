<template>
  <menu></menu>
  <div class="container-fluid">
	<item></item>
	<array v-ref:items></array>
  </div>
</template>

<script>
import TablesList from './TablesList.vue'
import TablesItem from './TablesItem.vue'
import TablesTable from './TablesTable.vue'

export default {
	events: {
		'refresh': function () {
			this.$refs.items.load()
		}
	},
	components: {
		'menu': TablesList,
		'item': TablesItem,
		'array': TablesTable
	}
}
</script>

<style>
body h1 {
	color: red;
	background-color: #ccc;
}
</style>
