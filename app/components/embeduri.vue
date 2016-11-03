<template>
  <div v-html="card">
    <img class="embed-uri-icon" src="/assets/img/favicon/favicon-32x32.png">
  </div>
</template>

<script>
import clone from 'clone'

export default {
  props: ['href', 'height'],
  data () {
    return {
      card: 'lorem ipsum'
    }
  },
  mounted () {
    console.log('embeduri', this.href)
    this.$nextTick(this.reload)
  },
  methods: {
    reload (done) {
      this.$http.get(this.href + "?alt=iframe").then(response => {
        console.log('embeduri get', response)
        const html = clone(response.body || 'n/a')
        const beg = html.indexOf('<body>') + '<body>'.length
        const end = html.indexOf('</body>')
        this.card = html.substring(beg, end)
      })
    }
  }
}
</script>

<style scoped>
.embed-uri-link {
    background: #D6DADC;
    border-radius: 3px;
    padding: 2px 4px;
}
.embed-uri-icon {
    height: 14px;
    margin-right: 3px;
    vertical-align: middle;
    width: 14px;
}
</style>
