import Vue from 'vue'

const getDefaultState = () => {
  return {
    activeFileId: null,
    undoLimit: 30,
    snap: true
  }
}

const state = getDefaultState()

const actions = {
  reset ({ commit }) {
    commit('resetState')
  },
  setActiveFileId({commit}, id) {
    commit('setActiveFileId', id);
  },
  toggleSnap({commit}) {
    commit('setSnap', !state.snap);
  }
}
const getters = {
}

const mutations = {
  resetState (state) {
    Object.assign(state, getDefaultState())
  },
  setUndoLimit (state, value) {
    Vue.set(state, 'undoLimit', value);
  },
  setActiveFileId (state, id) {
    Vue.set(state, 'activeFileId', id);
  },
  setSnap(state, value) {
    Vue.set(state, 'snap', value);
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
