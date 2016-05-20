<template>
 <div class="form-group">
	<label class="control-label" for="modal-load-input-file">File</label>
	<input data-type="POST" data-url="/-/v3/upload" id="modal-load-input-filename" type="file" name="inputFile" />
	<div class="input-group">
		<input type="text" readonly="" class="form-control" placeholder="Browse..." value="{{ filename }}">
		<span class="input-group-addon">{{ indicator }}</span>
	</div>
  </div>
</template>
<script>

export default {
	ready () {
	  let self = this;
      $('#modal-load-input-filename').fileupload({
        dataType: 'json',
        send: function(e, data) {
			self.indicator = '0%';
        },
        done: function(error, data) {
		  console.log('upload', data.result[0]);
          if (Array.isArray(data.result) && data.result[0]) {
            self.filename = data.result[0].name;
          }
		  self.indicator = '√';
        },
        progressall: function(e, data) {
		  let self = this;
          let progress = parseInt(data.loaded / data.total * 100, 10);
		  self.indicator = progress + '%';
        }
      });
	},
	data () {
		return {
			filename : '',
			indicator: '?'
		}
	},
	components: {
	},
	methods: {
    }
}
</script>
<style>
.btn-file {
  position: relative;
  overflow: hidden;
}
.btn-file input[type=file] {
  position: absolute;
  top: 0;
  right: 0;
  min-width: 100%;
  min-height: 100%;
  font-size: 100px;
  text-align: right;
  filter: alpha(opacity=0);
  opacity: 0;
  background: red;
  cursor: inherit;
  display: block;
}
input[readonly] {
  background-color: white !important;
  cursor: text !important;
}
</style>

