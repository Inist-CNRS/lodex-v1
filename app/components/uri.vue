<template>
	<div>
		<a target="_blank" rel="" class="known-uri-link" v-bind:href="href">
			  <img class="known-uri-icon" src="http://127.0.0.1:3000/assets/img/favicon/favicon-32x32.png">
			 {{ label }}
	    </a>
	</div>
</template>

<script>
export default {
  props: ['href', 'height'],
  data () {
    return {
      label: 'lorem ipsum'
    }
  }
}
</script>

<style scoped>
.known-uri-link {
    background: #D6DADC;
    border-radius: 3px;
    padding: 2px 4px;
}
.known-uri-icon {
    height: 14px;
    margin-right: 3px;
    vertical-align: middle;
    width: 14px;
}
</style>
