<template lang='pug'>
  v-layer(ref='gridLayer' :config='configLayer')
    v-line(v-for='(n, i) in width + 1' :key='`hline-${i}`' :config='configHLine(i)')
    v-line(v-for='(n, i) in height + 1' :key='`vline-${i}`' :config='configVLine(i)')
</template>

<script>
export default {
  props: {
    layerId: String,
    rectSize: Number,
    width: Number,
    height: Number,
    strokeSize: Number,
    strokeColor: String
  },
  data () {
    return {
      configLayer: {
        id: this.layerId
      },
      baseLineConfig: {
        stroke: this.strokeColor,
        strokeWidth: this.strokeSize
      }
    }
  },
  methods: {
    configHLine(i) {
      return {
        ...this.baseLineConfig,
        points: [i * this.rectSize, 0, i * this.rectSize, this.rectSize * this.height],
      }
    },
    configVLine(j) {
      return {
        ...this.baseLineConfig,
        points: [0, j * this.rectSize, this.rectSize * this.width, j * this.rectSize]
      }
    }
  }
}
</script>

<style>

</style>