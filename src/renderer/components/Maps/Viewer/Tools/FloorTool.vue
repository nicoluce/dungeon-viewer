<template lang='pug'>
  div
    v-circle(ref='pointer' :config='configPointer')
    v-rect(v-if='draw' ref='floor' :config='configFloor')
</template>

<script>
import { mapState } from 'vuex';
export default {
  props: {
    grid: Object,
    moduleNamespace: String
  },
  data() {
    return {
      x: 0,
      y: 0,
      isPointerInStage: false,
      draw: false,
      initPos: { x: 0, y: 0 }
    }
  },
  computed: {
    ...mapState('app', ['snap']),
    node() {
      return this.$refs.pointer.getNode();
    },
    stage() {
      return this.node.getStage()
    },
    gridSizeInPixel () {
      return {
        width: this.grid.rectSize * this.grid.width,
        height: this.grid.rectSize * this.grid.height
      }
    },
    configPointer() {
      const visible =
        this.isPointerInStage &&
        0 <= this.x &&
        0 <= this.y &&
        this.x <= this.gridSizeInPixel.width &&
        this.y <= this.gridSizeInPixel.height;
      return {
        visible,
        x: this.x,
        y: this.y,
        radius: 5,
        fill: '#f2ef96'
      };
    },
    configFloor() {
      return {
        x: this.initPos.x,
        y: this.initPos.y,
        width: this.x < 0 ? 0 : this.x - this.initPos.x,
        height: this.y < 0 ? 0 : this.y - this.initPos.y,
        fill: '#fcd7d7',
        stroke: '#f54242'
      };
    }
  },
  methods: {
    startDraw() {
      this.draw = true;
      this.initPos = { x: this.x, y: this.y };
    },
    endDraw() {
      this.draw = false;
    },
    updatePointer() {
      const transform = this.stage.getAbsoluteTransform().copy();
      // to detect relative position we need to invert transform
      transform.invert();

      // get pointer (say mouse or touch) position
      let pos = this.stage.getPointerPosition();

      // now we can find relative point
      pos = transform.point(pos);

      this.x = pos.x;
      this.y = pos.y;

      if (this.snap) {
        this.x = Math.round(this.x / this.grid.rectSize) * this.grid.rectSize;
        this.y = Math.round(this.y / this.grid.rectSize) * this.grid.rectSize;
      }
    },
    onLeave() {
      this.endDraw();
      this.isPointerInStage = false;
    },
    onEnter() {
      this.isPointerInStage = true;
    },
    indexes() {
      const width = Math.abs(this.configFloor.width / this.grid.rectSize);
      const height = Math.abs(this.configFloor.height / this.grid.rectSize);

      let y = this.initPos.y / this.grid.rectSize;
      if (Math.sign(this.configFloor.height) === -1) {
        y -= height;
      }
      let x = this.initPos.x / this.grid.rectSize;
      if (Math.sign(this.configFloor.width) === -1) {
        x -= width;
      }

      const res = [];
      for (let j = y ; j < y + height; j++) {
        for (let i = x; i < x + width; i++) {
          res.push(i + j * this.grid.width);
        }
      }
      return res;
    },
    confirmDraw() {
      const color = this.$store.getters['floors/currentColor'];
      const floorId = this.$store.getters['floors/selectedId'];
      const indexes = this.indexes();
      if (indexes.length === 0) {
        return;
      }
      const floorData = {
        floorId,
        ...this.configFloor
      };
      this.$store.commit(`${this.moduleNamespace}/addFloor`, floorData);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.stage.on('mousedown', (event) => {
        if (event.evt.button === 0) {
          this.startDraw();
        }
      });
      this.stage.on('mouseup',  (event) => {
        if (event.evt.button === 0) {
          this.confirmDraw();
        };
        this.endDraw();
      });
      this.stage.on('mousemove', this.updatePointer)
      this.stage.on('mouseleave', this.onLeave);
      this.stage.on('mouseenter', this.onEnter);
    });
  },
  beforeDestroy() {
    this.stage.off('mousedown mouseup mousemove mouseleave mouseenter');
  }
}
</script>

<style>

</style>