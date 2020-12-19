<template lang='pug'>
  v-app
    div(id="app")
      Notifications
      MainView
</template>

<script>
import './assets/css/main.css'
import Keyboard from './components/Keyboard'
import MainView from './views/MainView.vue'
import Notifications from './components/Notifications.vue'
import { mapState, mapGetters } from 'vuex'
import { ipcRenderer } from 'electron'

export default {
  name: 'app',
  components: {
    MainView,
    Notifications,
    Keyboard
  },
  computed: {
    ...mapGetters('files', ['dirtyFileIds']),
    ...mapState('app', ['activeFileId'])
  },
  mounted () {
    ipcRenderer.send('load:user-data');
    this.$store.dispatch('floors/load');
    ipcRenderer.on('save-current-file', () => {
      if (this.activeFileId !== null) {
        const data = this.$store.getters[`files/data-${this.activeFileId}/saveData`];
        ipcRenderer.send('save-file', this.activeFileId, JSON.stringify(data));
      }
    });
    ipcRenderer.on('close-current-file', () => {
      if (this.activeFileId !== null) {
        ipcRenderer.send('close-file', this.activeFileId);
      }
    });
    ipcRenderer.on('exit-app', async () => {
      try {
        await Promise.all(
          this.dirtyFileIds.map((id) =>
              ipcRenderer.sendSync('close-file', id)
                ? Promise.resolve()
                : Promise.reject()
            )
          );
        ipcRenderer.send('exit-app');
      } catch (err) {}
    });
    ipcRenderer.on('undo', async () => {
      if (this.activeFileId !== null) {
        this.$store.dispatch(`files/data-${this.activeFileId}/undo`);
      }
    });
    ipcRenderer.on('redo', async () => {
      if (this.activeFileId !== null) {
        this.$store.dispatch(`files/data-${this.activeFileId}/redo`);
      }
    });
  },
  beforeDestroy() {
    ipcRenderer.removeAllListeners();
  },
  errorCaptured(err) {
    console.log(err)
  }
}
</script>
<style>
  html {
    overflow-y: hidden !important;
  }
  body {
    margin: 0;
  }
  #app {
    height: 100%;
  }
  .swatch {
    cursor: pointer;
    width: 25px;
    height: 25px;
    border-radius: 25%;
  }
</style>