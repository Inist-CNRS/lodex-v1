<template>
  <div class="form-group">
	<input data-type="POST" data-url="/-/v3/upload" id="modal-load-input-filename" type="file" name="inputFile" style="display:none" />
	<label class="control-label" for="modal-load-input-file">{{ __('Name') }}</label>
	<div class="input-group">
	  <span class="input-group-btn">
		<button class="btn btn-default" type="button" @click="handleSelect()">
		  <span id="modal-load-input-file-label">Browse</span>
		  <span class="badge" id="modal-load-input-file-indicator" style="display:none">{{ indicator }}</span>
		</button>
	  </span>
	  <input id="modal-load-input-file" class="form-control" type="text" placeholder="Local file" value="{{ filename }}" readonly="true" style="cursor:auto" aria-describedby="modal-load-input-file-status" />
	  <span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true" style="display:none"></span>
	  <span id="modal-load-input-file-status" class="sr-only form-control-feedback" style="display:none">(success)</span>
	</div>
  </div>
</template>
<script>

export default {
	ready () {
	  let self = this;
      $('#modal-load-input-filename').change(function() {
		self.filename = $(this).val();
      });
      $('#modal-load-input-filename').fileupload({
        dataType: 'json',
        send: function(e, data) {
          $('#modal-load-input-file-label').hide(4, function() {
			self.indicator = '0%';
          });
        },
        done: function(error, data) {
          if (Array.isArray(data.result) && data.result[0]) {
            viewLoad.set('fileToLoad', data.result[0]);
          }
		  self.indicator = '100%';
		  /*
          $('#modal-load-tab-file > div').addClass('has-success has-feedback');
          $('#modal-load-tab-file .form-control-feedback').show();
          setTimeout(function() {
            $('#modal-load-input-file-indicator').hide(4, function() {
              $('#modal-load-input-file-label').show();
            });
          }, 2500);
		  */
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
			indicator: '0%'
		}
	},
	components: {
	},
	methods: {
	  handleSelect () {
        $('#modal-load-input-filename').click();
      }
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

