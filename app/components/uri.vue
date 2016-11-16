<template>
  <div>
    <a target="_blank" rel="" class="known-uri-link" v-bind:href="href">
        <img class="known-uri-icon" src="/assets/img/favicon/favicon-32x32.png">
       {{ label }}
    </a>
  </div>
</template>

<script>
import clone from 'clone'

export default {
  props: ['href', 'height'],
  data () {
    return {
      label: 'lorem ipsum'
    }
  },
  mounted () {
    this.$nextTick(this.reload)
  },
  methods: {
    reload (done) {
      this.$http.get(this.href + '?alt=min').then((response) => {
        this.label = clone(response.data[0].value || 'n/a')
      })
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
