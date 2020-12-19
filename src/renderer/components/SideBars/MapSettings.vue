<template lang='pug'>
  v-card(dark tile)
    v-card-title {{'Map & Grid Settings'}}
    v-card-text
      v-form(
          ref='form'
          v-model='valid'
          lazy-validation
      )
        v-container
          v-row(no-gutters justify='center')
            v-col
              v-text-field(filled required reverse v-model='fields.width' :rules='mapSizeRules' prefix='cells' suffix='Width: ')
              v-text-field(filled required reverse v-model='fields.height' :rules='mapSizeRules' prefix='cells' suffix='Height: ')
          v-row(no-gutters justify='center')
            v-col(:sm='8')
              v-text-field(filled required reverse v-model='fields.rectSize' :rules='cellSizeRules' suffix='Cell size: ' prefix=' ')
            v-col(:sm='4')
              v-select(filled required :items='units' :value='units[0]')
          v-row(no-gutters justify='center')
            v-card
              v-card-text
                v-color-picker(v-model='fields.strokeColor' show-swatches :width='250')
    v-card-actions
      v-row(no-gutters justify='space-between')
        v-btn(text @click='') Cancel
        v-btn(color='success' @click='') Confirm
</template>

<script>
import { is } from 'utils'

export default {
  data() {
    return {
      showModal: true,
      units: ['px', 'in', 'cm', 'mm'],
      mapSizeRules: [
        value => is.positiveInteger(value) || 'Invalid integer',
        value => value <= 100 || 'Max width is 100',
      ],
      cellSizeRules: [
        value => is.positiveInteger(value) || 'Invalid integer',
        value => value <= 100 || 'Max width is 100',
      ],
      showColorPicker: false,
      previousColor: '',
      valid: true,
      fields: {
        width: 10,
        height: 10,
        rectSize: 70,
        unit: 'px',
        strokeColor: '#000000FF'
      }
    };
  },
  watch: {
    showColorPicker() {
      if (this.showColorPicker) {
        this.previousColor = this.fields.strokeColor;
      }
    }
  }
}
</script>

<style>
</style>