<template>
	<div>
		<img v-bind:height="height" class="known-uri-icon" v-bind:src="src">
	</div>
</template>

<script>
export default {
  props: ['src', 'height']
}
</script>

<style scoped>
</style>
