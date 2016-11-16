<template>
  <div>
    <img v-bind:height="realHeight" class="known-uri-icon" v-bind:class="{ 'zoom-in': zoomIn, 'zoom-out': zoomOut }" v-bind:src="src" @click="toggleZoom">
  </div>
</template>

<script>
export default {
  props: ['src', 'height'],
  data () {
    return {
      zoomIn: false,
      zoomOut: true,
      realHeight: this.height
    }
  },
  methods: {
    toggleZoom () {
      this.zoomIn = !this.zoomIn
      this.zoomOut = !this.zoomOut
      if (this.zoomOut) {
        this.realHeight = this.height
      }
      else {
        this.realHeight = ''
      }
    }
  }
}
</script>

<style scoped>
.img.zoom-out {
  cursor: zoom-in;
  width: 100%;
  background-color: transparent;
}

.img.zoom-in {
  position: fixed;
  top: 0;
  left: 0;
  background-color: white;
  z-index: 10000;
  cursor: zoom-out;
}
</style>
