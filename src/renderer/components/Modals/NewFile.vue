<template lang='pug'>
  v-dialog(
    v-model='showModal'
    persistent
    max-width='250'
    v-on:keydown.enter.exact='onEnter'
    v-on:keydown.esc.exact='onEsc'
  )
    v-card(shaped)
      v-card-title New Map
      v-card-text
        v-form(
          ref='form'
          v-model='valid'
          lazy-validation
        )
          v-container
            v-row(no-gutters justify='end')
              v-col
                v-text-field(required reverse v-model='fields.width' :rules='mapSizeRules' prefix='cells' suffix='Width: ')
                v-text-field(required reverse v-model='fields.height' :rules='mapSizeRules' prefix='cells' suffix='Height: ')
            v-row(no-gutters justify='end')
              v-col(:sm='8')
                v-text-field(required reverse v-model='fields.rectSize' :rules='cellSizeRules' suffix='Cell size: ' prefix=' ')
              v-col(:sm='4')
                v-select(required :items='units' v-model='units[0]')
            v-row(no-gutters justify='end')
              v-col
                v-text-field(required prefix='Grid color: ' readonly :value='fields.strokeColor' v-on:click='showColorPicker=true')
                  template(v-slot:append)
                    div.swatch(v-bind:style='{"background-color": fields.strokeColor}' v-on:click='showColorPicker=true')
      v-card-actions
        v-row(no-gutters justify='space-around')
          v-btn(text @click='cancel') Cancel
          v-btn(color='success' @click='submit') Create
    v-dialog(
      v-if='showColorPicker'
      v-model='showColorPicker'
      hide-overlay
      width=300
    )
      v-card
        v-color-picker(v-model='fields.strokeColor')
</template>

<script>
import { is } from 'utils'
import { ipcRenderer } from 'electron';

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
        strokeColor: '#000000'
      }
    };
  },
  watch: {
    color(value) {
      // temporary fix while there is no way to disable the alpha channel in the colorpicker component: https://github.com/vuetifyjs/vuetify/issues/9590
      if (value.toString().match(/#[a-zA-Z0-9]{8}/)) {
        this.color = value.substr(0, 7);
      }
    },
    showModal() {
      if (!this.showModal) {
        ipcRenderer.emit('close-modal');
      }
    },
    showColorPicker() {
      if (this.showColorPicker) {
        this.previousColor = this.fields.strokeColor;
      }
    }
  },
  methods: {
    onEnter() {
      if (this.showColorPicker) {
        this.showColorPicker = false;
      } else {
        this.submit();
      }
    },
    onEsc() {
      if (this.showColorPicker) {
        this.showColorPicker = false;
        this.fields.strokeColor = this.previousColor;
      } else {
        this.cancel();
      }
    },
    submit() {
      if (this.$refs.form.validate()) {
        const grid = this.fields;
        [
          'width',
          'height',
          'rectSize'
        ].forEach((key) => {
          grid[key] = Number(grid[key]);
        });
        ipcRenderer.send('new-file', {grid: this.fields});
        this.showModal = false;
      }
    },
    cancel() {
      this.showModal = false;
    }
  },
}
</script>

<style scoped>
</style>