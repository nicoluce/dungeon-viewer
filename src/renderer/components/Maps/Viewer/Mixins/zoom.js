import {capNumber} from 'utils'
import utils from './utils'

const maxScale = 5
const zoomFactor = 1.25

export default {
  mixins: [utils],
  methods: {
    zoom (event) {
      if (event.deltaY === 0) {
        return
      }
      event.preventDefault()
      const oldScale = this.stage.scaleX()

      const pointer = this.stage.getPointerPosition()

      const mousePointTo = {
        x: (pointer.x - this.stage.x()) / oldScale,
        y: (pointer.y - this.stage.y()) / oldScale
      }

      const newScale = capNumber(
        -event.deltaY > 0
          ? oldScale * zoomFactor
          : oldScale / zoomFactor,
        this.minScale, maxScale
      )

      this.stage.scale({ x: newScale, y: newScale })

      const newPos = this.capStagePosition({
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale
      })
      this.stage.position(newPos)
      this.stage.batchDraw()
    }
  }
}
