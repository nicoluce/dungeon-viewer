<template lang='pug'>
  v-navigation-drawer(permanent)
    v-row.fill-height(no-gutters)
      v-navigation-drawer(dark mini-variant permanent)
        v-list-item.px-2
          v-list-item-avatar(size=64)
            v-img(:src='logoURL')
        v-divider
        v-list(shaped)
          v-list-item(v-for='activity in activities' :disabled='!isFileOpen' @click='openSideBar(activity.name)')
            v-icon(large :disabled='!isFileOpen') {{activity.icon}}
</template>
<script>
import { mapState } from 'vuex'
import { ipcRenderer } from 'electron'
import { is } from 'utils'

export default {
  data () {
    return {
      logoURL: require('@/assets/images/logo.jpg'),
      activities: [
        {name: 'MapSettings', icon: 'fas fa-th-large'},
        {name: 'FloorTool', icon: 'fas fa-layer-group'},
      ]
    }
  },
  computed: {
    ...mapState('app', ['activeFileId']),
    isFileOpen() {
      return is.id(this.activeFileId);
    }
  },
  methods: {
    openSideBar(name) {
      ipcRenderer.emit('activity-toggle', null, name);
    }
  }
}
</script>

<style scoped>
  .v-navigation-drawer {
    width: 80px !important;
  }

  .v-list-item {
    justify-content: center;
  }
</style>
