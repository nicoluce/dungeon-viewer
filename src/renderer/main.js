import Vue from 'vue'

import App from './App'
import store from '../store'
import VueKonva from 'vue-konva'
import vuetify from '@/plugins/vuetify'

Vue.use(VueKonva)
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  vuetify,
  store,
  template: '<App/>'
}).$mount('#app')
