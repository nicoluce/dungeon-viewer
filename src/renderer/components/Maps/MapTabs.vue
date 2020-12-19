<template lang='pug'>
  v-tabs(center-active dark :show-arrows='false' v-model='activeTab')
    template(v-for='id in fileIds')
      MapTab(:fileId='id')
    template(v-for='id in fileIds')
      v-tab-item(:key='`item-${id}`' :value='`file-${id}`')
        Viewer(:fileId='id')
</template>

<script>
import MapTab from './MapTab.vue'
import Viewer from './Viewer/Viewer'
import { mapGetters } from 'vuex'

export default {
  components: {
    MapTab,
    Viewer
  },
  data () {
    return {
      activeTab: null
    }
  },
  computed: {
    ...mapGetters('files', ['fileIds'])
  },
  watch: {
    activeTab () {
      this.$store.dispatch('app/setActiveFileId',
        this.activeTab
          ? Number(this.activeTab.substr('file-'.length))
          : null
      )
    }
  }
}
</script>
<style>
  .tab-container {
    height: 100%;
  }
  .v-tabs {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #202020;
  }
  .v-tabs-bar {
    background-color: #202020;
    height: 30px !important;
  }
  .v-slide-group__wrapper {
    cursor: pointer !important;
  }
  .v-window__container,
  .v-window-item,
  .v-tabs-items
  .v-card {
    height: 100% !important;
  }
</style>