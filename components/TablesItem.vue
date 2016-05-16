<template>
<div id="tables-item" class="row">
	<div class="pull-right">
		<div class="btn-group" role="group" aria-label="...">
			<button type="button" class="btn btn-default" @click="showModalFork = true"> <icon name="code-fork" label="Fork"> </button>
			<button type="button" class="btn btn-default" @click="showModalUpload = true"> <icon name="upload" label="Upload"> </button>
			<button type="button" class="btn btn-default" @click="showModalDownload = true"> <icon name="download" label="Download">  </button>
		</div>
	</div>
	<div>
		<alert type="info" >
			<span>Current: {{ store.currentTable.value }} </span>
		</alert>

	</div>
</div>

<modal :show.sync="showModalUpload" title="Upload to this table">
  <div slot="modal-body" class="modal-body">B</div>
</modal>
<modal :show.sync="showModalDownload" title="Download this table">
  <div slot="modal-body" class="modal-body">C</div>
</modal>
<modal :show.sync="showModalFork" title="Fork this table">
	<div slot="modal-body" class="modal-body">A<div>
</modal>

</template>
<script>
import sharedStore from './store.js'


export default {
	data () {
		return {
			store : sharedStore,
			showModalFork: false,
			showModalUpload: false,
			showModalDownload: false
		}
	},
	methods: {
		doFork() {
			alert('Forked');
		},
		doUpload() {
			alert('Uploaded');
		},
		doDownload() {
			alert('Download');
		}
	},
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
