import utils from './utils'

const delta = 20
const updateSpeed = 20

export default {
  mixins: [utils],
  data() {
    return {
      keyIntervals: {}
    }
  },
  methods: {
    pan(event) {
      event.preventDefault()

      const newPos = this.capStagePosition({
        x: this.stage.x() - event.deltaX,
        y: this.stage.y() - event.deltaY
      })
      this.stage.position(newPos)
      this.stage.batchDraw()
    },
    onKeyPress(event) {
      // TODO: Mejorar esto
      const { key, ctrlKey, shiftKey, altKey } = event
      if (ctrlKey || shiftKey || altKey) {
        if (this.keyIntervals[key]) {
          this.onKeyUp(event);
        }
        return
      }
      if (this.keyIntervals[key]) {
        return
      }
      let interval = null
      switch (key) {
        case 'w': {
          interval = setInterval(() => {
            const y = this.capStagePosition({x: 0, y: this.stage.y() + delta}).y
            this.stage.y(y)
            this.stage.batchDraw()
          }, updateSpeed)
        } break
        case 'a': {
          interval = setInterval(() => {
            const x = this.capStagePosition({x: this.stage.x() + delta, y: 0}).x
            this.stage.x(x)
            this.stage.batchDraw()
          }, updateSpeed)
        } break
        case 'd': {
          interval = setInterval(() => {
            const x = this.capStagePosition({x: this.stage.x() - delta, y: 0}).x
            this.stage.x(x)
            this.stage.batchDraw()
          }, updateSpeed)
        } break
        case 's': {
          interval = setInterval(() => {
            const y = this.capStagePosition({x: 0, y: this.stage.y() - delta}).y
            this.stage.y(y)
            this.stage.batchDraw()
          }, updateSpeed)
        } break
        default: return
      }
      this.keyIntervals[key] = interval
      event.preventDefault()
    },
    onKeyUp(event) {
      const { key } = event
      clearInterval(this.keyIntervals[key])
      this.keyIntervals[key] = null
    }
  }
}
