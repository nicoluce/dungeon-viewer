import {capNumber} from 'utils'

export default {
  methods: {
    capStagePosition (pos) {
      const scale = this.stage.scale()

      const minX = -((this.bgSizeInPixel.width - this.grid.rectSize * 2) * scale.x)
      const maxX = (this.bgSizeInPixel.width * 3 * scale.x)

      const minY = -((this.bgSizeInPixel.height - this.grid.rectSize * 2) * scale.y)
      const maxY = ((this.bgSizeInPixel.height + this.grid.rectSize * 2) * scale.y)

      const x = capNumber(pos.x, minX, maxX)
      const y = capNumber(pos.y, minY, maxY)

      return { x, y }
    }
  }
}
