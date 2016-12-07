<template>
  <ul>
  <li v-for="hit in hits">
    <span v-if="hit.pdfFulltext">
      <a :href="hit.pdfFulltext.uri">{{ hit.title }}</a>, {{ hit.publicationDate }}
    </span>
    <span v-else>
      {{ hit.title }}, {{ hit.publicationDate}}
    </span>
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
            .map(hit => {
              if (hit.fulltext) {
                hit.pdfFulltext = hit.fulltext.find((fulltext) => fulltext.extension === 'pdf')
              }
              return hit;
            })
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
