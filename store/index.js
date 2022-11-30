import Vue from 'vue'
import Vuex, { Store } from 'vuex'

import defaultSettings from './defaultSettings'

Vue.use(Vuex)

export const store = new Store({
  modules: {
    defaultSettings
  }
})
