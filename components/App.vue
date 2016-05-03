<template>
	<h1>{{ hello }} World !</h1>
	<alert type="info" >
	<strong>Heads up!</strong> This alert needs your attention, but it's not super important.
	</alert>
</template>

<script>
import alert from 'vue-strap/src/Alert.vue'

export default {
	components: {
					alert
	},
	data () {
		return {
			'hello': 'Hello'
		}
	}
}
</script>

<style>
body h1 {
	color: red;
	background-color: #ccc;
}
</style>
