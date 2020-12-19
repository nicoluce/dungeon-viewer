<template lang='pug'>
  v-card.sidebar(dark tile)
    v-card-title {{'Floor Tool'}}
    v-card-text
      v-form(
        ref='form'
        lazy-validation
      )
        v-container
          v-row(no-gutters justify='center')
            v-card
              v-card-text
                v-color-picker(v-model='color' show-swatches :width='250')
    v-card-actions
      v-row(no-gutters justify='space-between')
        v-btn(text @click='') Cancel
        v-btn(color='success' @click='') Confirm
</template>

<script>
export default {
  data() {
    return {
      color: ''
    };
  },
  watch: {
    color() {
      // temporary fix while there is no way to disable the alpha channel in the colorpicker component: https://github.com/vuetifyjs/vuetify/issues/9590
      if (this.color.toString().match(/#[a-zA-Z0-9]{8}/)) {
        this.color = this.color.substr(0, 7);
      }
      this.$store.commit('floors/setColor', this.color);
    }
  }
}
</script>

<style>

</style>