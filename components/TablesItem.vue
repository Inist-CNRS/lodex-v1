<template>
<div id="tables-item" class="row">
	<div class="pull-right">
		<div class="btn-group" role="group" aria-label="...">
			<button type="button" class="btn btn-default" @click="showModal = true"> <icon name="code-fork" label="Fork"> </button>
			<button type="button" class="btn btn-default"> <icon name="upload" label="Upload"> </button>
			<button type="button" class="btn btn-default"> <icon name="download" label="Download">  </button>
		</div>
	</div>
	<div>
		<span>Current: {{ store.currentTable.value }} </span>
	</div>
</div>

<modal :show.sync="showModal">
  <div slot="modal-header" class="modal-header">
    <h4 class="modal-title">Modal title</h4>
  </div>
  <div slot="modal-body" class="modal-body">...</div>
</modal>

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
