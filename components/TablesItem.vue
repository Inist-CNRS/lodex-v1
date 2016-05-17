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
  <div slot="modal-body" class="modal-body">

  <inputfile label="Browse" help="Try selecting one or more files and watch the feedback"><inputfile>
  
  </div>
  <div slot="modal-footer" class="modal-footer">
    <button type="button" class="btn btn-default" @click='showModalUpload = false'>Close</button>
    <button type="button" class="btn btn-success" @click='doUpload()'>Custom Save</button>
  </div>
</modal>
<modal :show.sync="showModalDownload" title="Download this table">
  <div slot="modal-body" class="modal-body">C</div>
  <div slot="modal-footer" class="modal-footer">
    <button type="button" class="btn btn-default" @click='showModalDownload = false'>Close</button>
    <button type="button" class="btn btn-success" @click='doDownload()'>Custom Save</button>
  </div>
</modal>
<modal :show.sync="showModalFork" title="Fork this table">
	<div slot="modal-body" class="modal-body">A<div>
	<div slot="modal-footer" class="modal-footer">
		<button type="button" class="btn btn-default" @click='showModalFork = false'>Close</button>
		<button type="button" class="btn btn-success" @click='doFork()'>Custom Save</button>
	</div>
</modal>

</template>
<script>
import sharedStore from './store.js'
import inputfile from './InputFile.vue'


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
			this.showModalFork = false
			alert('Forked');
		},
		doUpload() {
			this.showModalUpload = false
			alert('Uploaded');
		},
		doDownload() {
			this.showModalDownload = false
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
