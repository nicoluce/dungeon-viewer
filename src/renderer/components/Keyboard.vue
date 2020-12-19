<template lang='pug'>
  .wrapper(ref='keyboard')
</template>

<script>
export default {
  data () {
    return {
      pressed: {}
    }
  },
  methods: {
    customEvent () {
      const customEvent = new Event('c-keydown')
      customEvent.keys = Object.keys(this.pressed).filter((k) => this.pressed[k])
      return customEvent
    },
    onKeyDown (event) {
      const { key } = event
      this.pressed[key] = true
      event.target.dispatchEvent(this.customEvent())
    },
    onKeyUp (event) {
      const { key } = event
      this.pressed[key] = false
    }
  },
  mounted () {
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
  },
  beforeDestroy () {
    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('keyup', this.onKeyUp)
  }
}
</script>

<style>
  .wrapper {
    position: absolute;
    width: 100%;
    height: 100%;
  }
</style>