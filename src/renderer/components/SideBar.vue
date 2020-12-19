<template lang='pug'>
  keep-alive
    component.sidebar(v-bind:is='selectedActivity')
</template>

<script>
import MapSettings from './SideBars/MapSettings'
import FloorTool from './SideBars/FloorTool'
import { ipcRenderer } from 'electron';

export default {
  components: {
    MapSettings,
    FloorTool
  },
  data() {
    return {
      selectedActivity: null,
      selectedActivityName: null
    };
  },
  mounted() {
    ipcRenderer.on('activity-toggle', (event, activity) => {
      this.selectedActivity = this.selectedActivity === activity
        ? null : this.selectedActivity = activity;
    });
  }
}
</script>

<style scoped>
  .sidebar {
    height: 100%;
    width: 10cm;
    overflow: hidden;
  }
</style>