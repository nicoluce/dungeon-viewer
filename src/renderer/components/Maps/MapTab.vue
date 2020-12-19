<template lang='pug'>
  v-tab(:key='`tab-${fileId}`' :href='`#file-${fileId}`')
    label {{file.name}}
    v-btn(icon x-small v-on:mouseover='isBtnHovered=true' v-on:mouseleave='isBtnHovered=false')
      v-icon(x-small @click='closeFile(fileId)') {{icon}}
</template>

<script>
import { ipcRenderer } from 'electron'

export default {
  props: ['fileId'],
  data () {
    return {
      isBtnHovered: false
    }
  },
  computed: {
    file () {
      return this.$store.getters['files/getMetadata'](this.fileId)
    },
    icon () {
      return !this.file.isDirty || this.isBtnHovered
        ? 'fas fa-times'
        : 'fas fa-circle'
    }
  },
  methods: {
    closeFile (fileId) {
      this.$electron.ipcRenderer.send('close-file', fileId);
    }
  }
}
</script>

<style>
  .v-tab {
    justify-content: space-between !important;
    padding-right: 0 !important;
  }
  .v-window{
    flex: 1 !important;
  }
</style>