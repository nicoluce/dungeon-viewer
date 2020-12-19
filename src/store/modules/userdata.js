import Vue from 'vue';

const getDefaultState = () => {
  return {
    recentlyOpened: [],
    opened: [],
    seed: Math.random()
  }
}

const state = getDefaultState()

const actions = {
  reset ({ commit }) {
    commit('resetState')
  },
  clearRecentlyOpened({commit}) {
    commit('setRecentlyOpened', [])
  }
}
const getters = {
  data() {
    return state;
  },
  recentlyOpened(state) {
    return state.recentlyOpened;
  }
}

const mutations = {
  resetState (state) {
    Object.assign(state, getDefaultState())
  },
  addOpened (state, path) {
    if (!state.opened.includes(path)) {
      state.opened.push(path);
    }
  },
  addRecentlyOpened (state, path) {
    if (!state.recentlyOpened.includes(path)) {
      state.recentlyOpened.push(path);
    }
  },
  setOpened (state, val) {
    state.opened = val
  },
  setRecentlyOpened (state, val) {
    state.recentlyOpened = val
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
