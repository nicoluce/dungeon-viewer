<template lang='pug'>
  v-layer(ref='floorLayer' :config='configLayer')
    v-rect(v-for='(floor, i) in floorsPlaced' :key='i' :config='floor')
</template>

<script>
import { mapState } from 'vuex';
export default {
  props: {
    layerId: String,
    grid: Object,
    moduleNamespace: String
  },
  data () {
    return {
      configLayer: {
        id: this.layerId
      }
    };
  },
  computed: {
    ...mapState('userdata', ['seed']),
    data () {
      return this.$store.getters[`${this.moduleNamespace}/data`]
    },
    floorsPlaced () {
      return this.data.floors;
    }
  },
  methods: {
    configFloor({ id }) {
      
    }
  }
}
</script>

<style>

</style>