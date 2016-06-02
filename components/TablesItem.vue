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
			<span>Current: {{ store.currentTable.title }} </span>
		</alert>

	</div>
</div>

<modal :show.sync="showModalUpload" title="Upload to this table">
  <div slot="modal-body" class="modal-body">

	<div class="form-group">
		<label class="control-label" for="modal-load-input-type-a">Type</label>
		<select id="modal-load-input-type-a" class="form-control modal-load-shared-type">
			  <option value="xml">XML document</option>
			  <option value="xls">Excel rows</option>
			  <option value="csv">CSV rows</option>
			  <option value="nq">N-Quads lines</option>
			  <option value="json">JSON corpus</option>
		</select>
	</div>
	<inputfile v-bind:filename.sync="fileNameToUpload" label="Browse" help="Try selecting one or more files and watch the feedback"><inputfile>
  </div>
  <div slot="modal-footer" class="modal-footer">
    <button type="button" class="btn btn-default" @click='showModalUpload = false'>Close</button>
	<button type="button" class="btn btn-primary" v-on:click="beginUpload()">
		<span v-show="showSpinnerUpload" class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> {{ labelButtonUpload }}
	</button>

  </div>
</modal>
<modal :show.sync="showModalDownload" title="Download this table">
  <div slot="modal-body" class="modal-body">
  			<ul class="nav nav-pills nav-justified">
				<li>
				</li>
			  <li role="presentation">
				  <a href="/{{ store.currentTable.name}}/*?alt=xlsx" @click="showModalDownload = false"><icon name="file-excel" scale="2"></icon><br/>Excel</a>
			  </li>
			  <li role="presentation">
				  <a href="/{{ store.currentTable.name}}/*?alt=tsv" @click="showModalDownload = false"><icon name="list" scale="2"></icon><br>TSV</a>
			  </li>
			  <li role="presentation">
				  <a href="/{{ store.currentTable.name}}/*?alt=csv" @click="showModalDownload = false"><icon name="table" scale="2"></icon><br>CSV</a>
			  </li>
			  <li role="presentation">
				  <a href="/{{ store.currentTable.name}}/*?alt=nq" @click="showModalDownload = false"><icon name="bars" scale="2"></icon><br>N-Quads</a>
			  </li>
			  <li role="presentation">
				  <a href="/{{ store.currentTable.name}}/*?alt=nq.xlsx" @click="showModalDownload = false"><icon name="file-excel-o" scale="2"></icon><br>N-Quads<br>(Excel)</a>
			  </li>
			  <li role="presentation">
				  <a href="/{{ store.currentTable.name}}/*?alt=jsonld" @click="showModalDownload = false"><icon name="file-o" scale="2"></icon><br> JSON LD</a>
			  </li>
			</ul>
  </div>
  <div slot="modal-footer" class="modal-footer">
    <button type="button" class="btn btn-default" @click='showModalDownload = false'>Close</button>
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
import heartbeats from 'heartbeats'

const heart = heartbeats.createHeart(100);

export default {
	data () {
		return {
			store : sharedStore,
			file: {},
			showModalFork: false,
			showModalUpload: false,
			showModalDownload: false,
			showSpinnerUpload: false,
			labelButtonUpload: "Save",
			fileNameToUpload: ""
		}
	},
	methods: {
		doFork() {
			this.showModalFork = false
			alert('Forked');
		},
		resetUpload() {
			this.file = {}
			heart.killEvent('spin')
			this.showModalUpload = false
			this.labelButtonUpload = "Save"
			this.showSpinnerUpload = false
			this.fileNameToUpload = ""
		},
		beginUpload() {
			if (this.showModalUpload === true) {
				this.labelButtonUpload = "Saving..."
				this.showSpinnerUpload = true
				let self = this
				let url = '/' + self.store.currentTable.name  + '/?typ=file';
				let dta = {
					file : self.file
				};
				let first =  true;
				console.log('POST #1 ' + url, dta);
				heart.createEvent(20, {name: 'spin', repeat: 20}, function(heartbeat, last) {
					if (first === true) {
						first = false;
						self.$http.post(url, dta).then(function (response) {
							console.log('POST #2 ' + url, response);
							self.resetUpload();
							self.$dispatch('refresh')

						}, function(error) {
							console.log('POST #2 ' + url, error);
							self.resetUpload();
						})
					}
					else {
					}
				})

			}
		},
		doDownload() {
			this.showModalDownload = false
			alert('Download');
		}
	},
	events: {
		'uploaded': function (fs) {
			this.file = fs;
		}
	},
	components: {
		inputfile
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
