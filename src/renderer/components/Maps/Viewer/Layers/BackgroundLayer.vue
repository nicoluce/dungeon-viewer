<template lang='pug'>
  v-layer(ref='bgLayer' :config='configLayer')
    v-rect(:config='configRect')
</template>

<script>
export default {
  props: {
    layerId: String,
    rectSize: Number,
    width: Number,
    height: Number
  },
  data () {
    return {
      configLayer: {id: this.layerId}
    }
  },
  computed: {
    configRect () {
      const margin = 2
      return {
        x: this.rectSize * -margin,
        y: this.rectSize * -margin,
        width: this.rectSize * (this.width + margin * 2),
        height: this.rectSize * (this.height + margin * 2),
        fill: '#FFFFFF',
        shadowColor: '#FFFFFF'
      }
    }
  }
}
</script>

<style>
</style>