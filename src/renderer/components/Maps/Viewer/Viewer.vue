<template lang='pug'>
  .konva-container(ref='container' v-on:keypress='onKeyPress' v-on:keyup='onKeyUp' v-on:wheel.exact='zoom' v-on:wheel.ctrl.exact='pan')
    v-stage(ref='konva' :config='configKonva' :id='canvasId')
      BackgroundLayer(layerId='bg-layer' v-bind='grid')
      FloorLayer(layerId='floor-layer' :moduleNamespace='moduleNamespace' :grid='grid')
      GridLayer(layerId='grid-layer' v-bind='grid')
      template(v-if='selectedTool')
        v-layer(ref='toolLayer' :config='{id: "tool-layer"}')
          component.tool(v-bind:is='selectedTool' :moduleNamespace='moduleNamespace' :grid='grid')
</template>

<script>
import Vue from 'vue'
import FileDataModule from 'store/modules/filedata'
import BackgroundLayer from './Layers/BackgroundLayer'
import GridLayer from './Layers/GridLayer'
import FloorLayer from './Layers/FloorLayer'
import FloorTool from './Tools/FloorTool'
import Mixins from './Mixins'
import { ipcRenderer } from 'electron'

export default {
  props: ['fileId'],
  mixins: Mixins,
  components: {
    BackgroundLayer,
    GridLayer,
    FloorLayer,
    FloorTool
  },
  data () {
    return {
      draggable: false,
      containerSize: {
        width: 1,
        height: 1
      },
      moduleName: ['files', `data-${this.fileId}`],
      selectedTool: null,
      pointerPosition: { x: 0, y: 0 }
    }
  },
  created () {
    const moduleExists = this.$store.hasModule(this.moduleName);
    if (!moduleExists) {
      this.$store.registerModule(
        ['files', `data-${this.fileId}`],
        FileDataModule(this.fileId)
      );
      if (!this.metadata.isTemp) {
        const data = ipcRenderer.sendSync('load-file', this.metadata.path);
        this.$store.dispatch(`${this.moduleNamespace}/load`, data)
      } else {
        const data = this.$store.getters['files/newConfig'];
        this.$store.dispatch(`${this.moduleNamespace}/load`, data)
      }
    }
  },
  computed: {
    moduleNamespace () {
      return this.moduleName.join('/')
    },
    metadata () {
      return this.$store.getters[`files/getMetadata`](this.fileId)
    },
    data () {
      return this.$store.getters[`${this.moduleNamespace}/data`]
    },
    grid () {
      return this.data.grid
    },
    floors () {
      return this.data.floors
    },
    canvasId () {
      return `canvas-${this.fileId}`
    },
    stage () {
      if (this.$refs.konva) {
        return this.$refs.konva.getStage()
      }
    },
    gridSizeInPixel () {
      return {
        width: this.grid.rectSize * this.grid.width,
        height: this.grid.rectSize * this.grid.height
      }
    },
    bgSizeInPixel () {
      return {
        width: this.grid.rectSize * (this.grid.width + 4),
        height: this.grid.rectSize * (this.grid.height + 4)
      }
    },
    middlePos () {
      return {
        x: this.stage.width() / 2 - this.gridSizeInPixel.width / 2 * this.stage.scaleX(),
        y: this.stage.height() / 2 - this.gridSizeInPixel.height / 2 * this.stage.scaleY()
      }
    },
    minScale () {
      return Math.max(
        0.2,
        Math.min(
          this.containerSize.width / this.bgSizeInPixel.width,
          this.containerSize.height / this.bgSizeInPixel.height
        )
      )
    },
    configKonva () {
      return {
        x: 0,
        y: 0,
        width: 1,
        height: 1,
        scale: {x: 1, y: 1}
      }
    }
  },
  watch: {
    draggable () {
      this.stage.draggable(this.draggable)
    }
  },
  methods: {
    updateContainerSize () {
      Vue.set(this.containerSize, 'width', this.$refs.container.offsetWidth);
      Vue.set(this.containerSize, 'height', this.$refs.container.offsetHeight);
    },
    resizeStage (event) {
      // TODO: arreglar esto
      if (event && !event.isTrusted) {
        return
      }
      this.updateContainerSize();

      this.stage.size(this.containerSize);
      if (this.minScale > this.stage.scaleY()) {
        this.stage.scale({x: this.minScale, y: this.minScale});
      }
      this.stage.batchDraw();
    }
  },
  mounted () {
    this.configKonva.container = this.canvasId;
    this.$nextTick(() => {
      this.resizeStage();
      this.$nextTick(() => {
        this.stage.scale({x: this.minScale, y: this.minScale});
        this.stage.position(this.middlePos);
      });
    });
    this.$refs.container.tabIndex = 1;
    window.addEventListener('resize', this.resizeStage);

    ipcRenderer.on('activity-toggle', (event, activity) => {
      this.selectedTool = this.selectedTool === activity
        ? null : this.selectedTool = activity;
    });
  },
  updated () {
    this.resizeStage();
  },
  beforeDestroy () {
    this.$store.unregisterModule(this.moduleName);
  }
}
</script>

<style scoped>
  .konva-container {
    width: 100%;
    height: 100%;
    background: gray;
    outline: 0;
  }
</style>