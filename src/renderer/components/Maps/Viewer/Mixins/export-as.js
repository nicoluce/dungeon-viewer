export default {
  methods: {
    exportAs () {
      // window.backend.Application.SelectSaveFileToExport().then((path) => {
      //   const layers = this.stage.getLayers();
      //   const bgLayerIdx = layers.findIndex((layer) => layer.id() === 'bg-layer');

      //   const oldVisibility = layers[bgLayerIdx].visible()
      //   const oldScale = this.stage.scale();

      //   layers[bgLayerIdx].visible(false)
      //   this.stage.scale({x:1, y:1});

      //   const data = this.stage.toDataURL({
      //     mimeType: 'image/png',
      //     x: this.stage.x() - 1,
      //     y: this.stage.y() - 1,
      //     width: this.gridSizeInPixel.width,
      //     height: this.gridSizeInPixel.height
      //   });

      //   layers[bgLayerIdx].visible(oldVisibility)
      //   this.stage.scale(oldScale);

      //   window.backend.Application.ExportAs(path, data);
      // });
    }
  },
  mounted () {
    // window.wails.Events.On('export-as', (fileId) => {
    //   if (fileId !== this.fileId) {
    //     return
    //   }
    //   this.exportAs()
    // })
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resizeStage)
  }
}
