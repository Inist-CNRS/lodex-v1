<template>
	<a v-bind:href="link" target="_blank" rel="" class="known-uri-link">
		  <img class="known-uri-icon" src="http://127.0.0.1:3000/assets/img/favicon/favicon-32x32.png">
		  {{ label }}
	</a>
</template>

<script>
//import MQS from 'mongodb-querystring'
//import clone from 'clone'
export default {
  props: ['title', 'mode'],
  mounted () {
    // const self = this
    // self.reload()
    this.$nextTick(this.reload)
  },
  data () {
    return {
      label: 'XXXX',
      link: 'ZZZZ'
    }
  },
  methods: {
    reload (done) {
      const self = this
      const qry = {
      }
	  /*
      const url = window.location.protocol
      .concat('//')
      .concat(window.location.host)
      .concat('/' + self.query)
      .concat('&' + MQS.stringify(qry, {}))
      self.$http.get(url).then(function (response) {
        if (self.mode === 'value') {
          self.value = clone(response.data[0].value)
        }
        else {
          self.value = clone(response.data.length)
        }
      })
	  */
    }
  }
}
</script>
<style scoped>
.known-service-link {
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
