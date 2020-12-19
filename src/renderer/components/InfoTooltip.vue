<template lang='pug'>
  v-hover(v-slot:default="{ hover }")
    v-btn(fab x-small bottom right absolute)
      v-icon(small :color='hover ? "blue darken-2" : ""') fas fa-info-circle
</template>

<script>
export default {
  data () {
    return {
      infoMessages: [
        'Use wheel to zoom',
        'Use wheel to zoom'
      ]
    }
  }
}
</script>

<style scoped>
  .v-btn {
    margin-bottom: 30px;
    opacity: 0.5;
  }
  .v-btn:hover {
    opacity: 1;
  }
</style>