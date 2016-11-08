<template>
  <div :class="{ inline: inline }">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: ['inline']
  // props: {
  //   inline: {
  //     type: Boolean,
  //     default: false
  //   }
  // }
}
</script>

<style scoped>
.inline {
  display: inline;
}

.inline > ul {
  display: inline;
  list-style: none;
  padding-left: 0;
}

.inline > ul > li {
  display: inline;
}

.inline >ul > li:after {
  content: ", ";
}

.inline >ul > li:last-child:after {
  content: "";
}
</style>
