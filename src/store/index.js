import Vue from 'vue'
import Vuex from 'vuex'

import vuexElectron from './plugins/vuex-electron'

import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  plugins: [
    vuexElectron
  ],
  strict: process.env.NODE_ENV !== 'production'
})
