<template>
  <ul>
  <li v-for="hit in hits">
    {{ hit.title }}, {{ hit.publicationDate}}
  </li>
  </ul>
</template>

<script>
export default {
  props: {
    query: {
      type: String,
      default: '*'
    }
  },
  data () {
    return {
      hits: []
    }
  },
  mounted () {
    this.$nextTick(this.reload)
  },
  methods: {
    reload () {
      this.$http.get(`https://api.istex.fr/document/?q=${this.query}&output=*`).then((response) => {
        if (response && response.data && response.data.total && response.data.hits) {
          this.hits = response.data.hits
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
