<template>
<div id="tables-item" class="row">
	<form class="form-inline pull-right">
	<div class="dropdown">
		<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
			Download
			<span class="caret"></span>
		</button>
		<ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
			<li><a class="dropdown-item" href="#">CSV</a></li>
			<li><a class="dropdown-item" href="#">TSV</a></li>
			<li><a class="dropdown-item" href="#">N-Quads</a></li>
			<li><a class="dropdown-item" href="#">JSON-LD</a></li>
			<li><a class="dropdown-item" href="#">RAW</a></li>
		</ul>
	</div>
	</form>
	<span>Current: {{ store.currentTable.value }} </span>
</div>
</template>
<script>
import sharedStore from './store.js'

export default {
	data () {
		return {
			store : sharedStore
		}
	},
	methods: { },
	components: {
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
