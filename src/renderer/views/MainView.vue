<template lang='pug'>
  v-container
    NewFile(v-if='showModal === "new-file"')
    v-row(no-gutters)
      v-col(cols='auto')
        ActivityBar
      v-col(cols='auto')
        SideBar
      v-col.main
        InfoToolTip(v-if='activeFileId !== null')
        MapTabs
</template>

<script>
import InfoToolTip from '../components/InfoTooltip'
import MapTabs from '../components/Maps/MapTabs'
import ActivityBar from '../components/ActivityBar'
import SideBar from '../components/SideBar'
import NewFile from '../components/Modals/NewFile'
import {mapState} from 'vuex'
import { ipcRenderer } from 'electron'

export default {
  components: {
    ActivityBar,
    SideBar,
    MapTabs,
    InfoToolTip,
    NewFile
  },
  data() {
    return {
      showModal: null
    };
  },
  computed: {
    ...mapState('app', ['activeFileId'])
  },
  mounted() {
    ipcRenderer.on('show-modal', (event, name) => {
      this.showModal = name;
    });
    ipcRenderer.on('close-modal', (event, name) => {
      this.showModal = null;
    });
  }
}
</script>

<style>
  .container {
    padding: 0 !important;
    margin: 0 !important;
    height: 100%;
    max-width: none !important;
  }
  .row {
    height: 100%;
  }
  .main {
    overflow: hidden;
  }
</style>
